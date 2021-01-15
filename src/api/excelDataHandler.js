const path = require('path');
const XLSX = require('xlsx');
const persistStorage = require('node-persist');
const objectTimeline = persistStorage.create({ dir: './storage/importObjects' });
const { getNotAllowedStrings, getObjectModelsAndTypes } = require('../importedFilterConfig');


try {
    initializeStorage();
} catch (e) {
    throw new Error('Initialze of timeline storage failed: ' + e);
}

function readData() {
    let data = {
        filteredObjects: [],
        browserObjects: [],
        summary: {
            objectModels: []
        }
    };

    let workbook = XLSX.readFile(path.join(__dirname, '../import/' + process.env.FILE));
    let sheet_name_list = workbook.SheetNames;
    data.notAllowedStrings = getNotAllowedStrings();
    data.validObjectModels = getObjectModelsAndTypes();
    data.browserObjects = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { defval: "", range: 2 });
    getObjectModelsAndTypes().forEach(item => {
        data.summary.objectModels.push({
            model: item.objectModel,
            amount: 0,
        });
    });
    data.summary = {
        objectsTotal: data.browserObjects.length,
        objectsWithAlias: data.browserObjects.filter(object => object['Alias'] !== "").length,
        objectsMatchObjectModels: data.browserObjects.filter(object => data.validObjectModels.map(({ objectModel }) => objectModel).includes(object['Object Model'])).length,
        objectsMatchNotAllowedStrings: data.browserObjects.filter(object => !checkIfItsAnAllowedStringValue(object, data.notAllowedStrings)).length,
        imported_at: new Date()
    };
    data.browserObjects.forEach(object => {
        if (object['Alias'] !== "" && data.validObjectModels.map(({ objectModel }) => objectModel).includes(object['Object Model']) &&
            checkIfItsAnAllowedStringValue(object, data.notAllowedStrings)) {
            let finalObject = {};
            let objectRefPreEdit = object['Object Designation [System1.Management View]'].replace(/System1.ManagementView:|System1.ApplicationView:/g, "");
            finalObject.building = objectRefPreEdit.slice(39, 42);
            finalObject.opcTag = objectRefPreEdit + "." + data.validObjectModels.find(item => item.objectModel === object['Object Model']).readProperty;
            finalObject.subsystemType = objectRefPreEdit.slice(43, 46).replace(".", "");
            finalObject.dataType = data.validObjectModels.find(item => item.objectModel === object['Object Model']).dataType;
            finalObject.unit = object['Main Value.Unit'];
            finalObject.minValue = object['Main Value.Min'];
            finalObject.maxValue = object['Main Value.Max'];
            finalObject.alias = object['Alias'];
            finalObject.description = object['Object Description'];
            data.filteredObjects.push(finalObject);
            updateObjectModelSummary(data.validObjectModels, object);
        }
    });
    data.summary.validObjects = data.filteredObjects.length;
    data.summary.analogValues = data.filteredObjects.filter(object => object.dataType === "VT_R8").length;
    data.summary.binaryValues = data.filteredObjects.filter(object => object.dataType === "VT_UI4").length;
    data.summary.desigoCCValues = data.filteredObjects.filter(object => object.dataType === "VT_BOOL" || object.dataType === "VT_I4").length;
    data.summary.S7Values = data.filteredObjects.filter(object => object.subsystemType === "S7").length;
    data.summary.BACValues = data.filteredObjects.filter(object => object.subsystemType === "BAC").length;
    objectTimeline.setItem(data.summary.imported_at.toISOString(), data).then(() => {}).catch(e => {
        throw new Error("Timeline storage failed: " + e);
    });
}

function createOPCfiles(fileName) {
    let browserObjects = objectTimeline.get(fileName);
    createClientExcel(getClientList(browserObjects.filteredObjects, "BAC", "B01"), "01");
    createClientExcel(getClientList(browserObjects.filteredObjects, "BAC", "B02"), "02");
    createClientExcel(getClientList(browserObjects.filteredObjects, "BAC", "B03", "B05", "B06", "B07"), "03");
    createClientExcel(getClientList(browserObjects.filteredObjects, "S7", "B06"), "04");
    createClientExcel(getClientList(browserObjects.filteredObjects, "S7", "B01", "B02", "B03", "B04"), "05");

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

}

//Internal functions
function getClientList(filteredObjects, subsystemType, buildingOption1, buildingOption2, buildingOption3, buildingOption4) {
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

async function initializeStorage() {
    await objectTimeline.init();
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

function updateObjectModelSummary(models, object) {
    for (var i in models) {
        if (models[i].model === object['Object Model']) {
            models[i].amount = models[i].amount + 1;
            break;
        }
    }
}

async function getData() {
    let timeline = [];
    await objectTimeline.forEach(item => {
        timeline.push(item);
    });
    return timeline;
}

async function getSumData() {
    let timeline = [];
    await objectTimeline.forEach(item => {
        timeline.push(item.value.summary);
    });
    return timeline;
}

module.exports = {
    readData,
    createOPCfiles,
    getData,
    getSumData,
}