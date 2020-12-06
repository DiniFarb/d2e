const path = require('path');
const XLSX = require('xlsx');
const persistStorage = require('node-persist');
const summaryTimeline = persistStorage.create({ dir: './storage/importTimeline' });
const { getNotAllowedStrings, getObjectModelsAndTypes } = require('../importedFilterConfig');
let browserObjects = [];
let filteredObjects = [];
let summary = {};
const models = getObjectModelsAndTypes();

try {
    initializeStorage()
} catch (e) {
    throw new Error('Initialze of timeline storage failed: ' + e);
}

function readDataAndCreateFiles() {
    let notAllowedStrings = getNotAllowedStrings();
    let workbook = XLSX.readFile(path.join(__dirname, '../import/' + process.env.FILE));
    let sheet_name_list = workbook.SheetNames;
    //just make sure objects lists are is empty by reimport
    deleteData();
    browserObjects = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: "", range: 2 });
    summary = {
        objectModels: [],
        objectsTotal: browserObjects.length,
        objectsWithAlias: browserObjects.filter(object => object['Alias'] !== "").length,
        objectsMatchObjectModels: browserObjects.filter(object => models.map(({ objectModel }) => objectModel).includes(object['Object Model'])).length,
        objectsMatchNotAllowedStrings: browserObjects.filter(object => !checkIfItsAnAllowedStringValue(object, notAllowedStrings)).length,
        imported_at: new Date()
    };
    browserObjects.forEach(object => {
        if (object['Alias'] !== "" && models.map(({ objectModel }) => objectModel).includes(object['Object Model']) &&
            checkIfItsAnAllowedStringValue(object, notAllowedStrings)) {
            let finalObject = {};
            let objectRefPreEdit = object['Object Designation [System1.Management View]'].replace(/System1.ManagementView:|System1.ApplicationView:/g, "");
            finalObject.building = objectRefPreEdit.slice(39, 42);
            finalObject.opcTag = objectRefPreEdit + "." + models.find(item => item.objectModel === object['Object Model']).readProperty;
            finalObject.subsystemType = objectRefPreEdit.slice(43, 46).replace(".", "");
            finalObject.dataType = models.find(item => item.objectModel === object['Object Model']).dataType;
            finalObject.unit = object['Main Value.Unit'];
            finalObject.minValue = object['Main Value.Min'];
            finalObject.maxValue = object['Main Value.Max'];
            finalObject.alias = object['Alias'];
            finalObject.description = object['Object Description'];
            filteredObjects.push(finalObject);
            updateObjectModelSummary(object);
        }
    });
    summary.validObjects = filteredObjects.length;
    summary.analogValues = filteredObjects.filter(object => object.dataType === "VT_R8").length;
    summary.binaryValues = filteredObjects.filter(object => object.dataType === "VT_UI4").length;
    summary.desigoCCValues = filteredObjects.filter(object => object.dataType === "VT_BOOL" || object.dataType === "VT_I4").length;
    summary.S7Values = filteredObjects.filter(object => object.subsystemType === "S7").length;
    summary.BACValues = filteredObjects.filter(object => object.subsystemType === "BAC").length;
    createClientExcel(getClientList("BAC", "B01"), "01");
    createClientExcel(getClientList("BAC", "B02"), "02");
    createClientExcel(getClientList("BAC", "B03", "B05", "B06", "B07"), "03");
    createClientExcel(getClientList("S7", "B06"), "04");
    createClientExcel(getClientList("S7", "B01", "B02", "B03", "B04"), "05");
    let wbClient06 = XLSX.utils.book_new();
    let managementData = [];
    filteredObjects.filter(object => object.dataType === "VT_BOOL" || object.dataType === "VT_I4").forEach(object => {
        object.building = "other";
        object.subsystemType = "desigoCC";
        managementData.push(object);
    });
    let dataClient06 = XLSX.utils.json_to_sheet(managementData);
    dataClient06["!autofilter"] = { ref: "A1:I9" };
    XLSX.utils.book_append_sheet(wbClient06, dataClient06, "Client006_Management");
    XLSX.writeFile(wbClient06, path.join(__dirname, '../download/client006.xlsx'));
    let wbAlias = XLSX.utils.book_new();
    let aliasList = [];
    filteredObjects.forEach(object => {
        aliasList.push({
            Alias: object.alias
        });
    });
    let alias = XLSX.utils.json_to_sheet(aliasList);
    XLSX.utils.book_append_sheet(wbAlias, alias, "AliasList");
    XLSX.writeFile(wbAlias, path.join(__dirname, '../download/alias_list.xlsx'));
    summaryTimeline.setItem(summary.imported_at.toUTCString(), summary).then(() => {}).catch(e => {
        throw new Error("Timeline storage failed: " + e);
    });
}

function getClientList(subsystemType, buildingOption1, buildingOption2, buildingOption3, buildingOption4) {
    if (filteredObjects.length !== 0) {
        return filteredObjects.filter(object =>
            (object.building === buildingOption1 ||
                object.building === buildingOption2 ||
                object.building === buildingOption3 ||
                object.building === buildingOption4) &&
            object.subsystemType === subsystemType);
    } else throw new Error("No data imported yet");
}

function createClientExcel(data, clientNumber) {
    let wb = XLSX.utils.book_new();
    let data_R8 = XLSX.utils.json_to_sheet(data.filter(object => object.dataType === "VT_R8"));
    let data_UI4 = XLSX.utils.json_to_sheet(data.filter(object => object.dataType === "VT_UI4"));
    data_R8["!autofilter"] = { ref: "A1:I9" };
    data_UI4["!autofilter"] = { ref: "A1:I9" };
    XLSX.utils.book_append_sheet(wb, data_R8, "Client" + clientNumber + "_VT_R8");
    XLSX.utils.book_append_sheet(wb, data_UI4, "Client" + clientNumber + " BAC_VT_UI4");
    XLSX.writeFile(wb, path.join(__dirname, '../download/client0' + clientNumber + '.xlsx'));
}

async function getDataSummary() {
    let timeline = [];
    await summaryTimeline.forEach(item => {
        timeline.push(item);
    });
    return timeline;
}

async function initializeStorage() {
    await summaryTimeline.init();
}

function checkIfItsAnAllowedStringValue(object, notAllowedStrings) {
    let callback = true;
    notAllowedStrings.forEach(item => {
        if (object['Object Designation [System1.Management View]'].includes(item.objectDesignation) && (
                object['Object Description'].includes(item.objectDescriptionOption1) ||
                object['Object Description'].includes(item.objectDescriptionOption2))) {
            callback = false;
        }
    })
    return callback;
}

function deleteData() {
    browserObjects = [];
    filteredObjects = [];
    summary = {};
    importState = false;
}

function updateObjectModelSummary(object) {
    //create list if it does not exist
    if (summary.objectModels.length === 0) {
        models.forEach(item => {
            summary.objectModels.push({
                model: item.objectModel,
                amount: 0,
            });
        });
    }
    for (var i in summary.objectModels) {
        if (summary.objectModels[i].model === object['Object Model']) {
            summary.objectModels[i].amount = summary.objectModels[i].amount + 1;
            break;
        }
    }
}

module.exports = {
    readDataFromExcelFile: readDataAndCreateFiles,
    getClientList,
    getDataSummary
}