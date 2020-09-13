const path = require('path');
const XLSX = require('xlsx');
const {getNotAllowedStrings , getObjectModelsAndTypes}= require('../importedFilterConfig');
let browserObjects = [];
let filteredObjects = [];
let summary = {};
let importState = false;

function readDataAndCreateFiles() {
    let objectModelsAndTypes = getObjectModelsAndTypes();
    let notAllowedStrings = getNotAllowedStrings();
    let workbook = XLSX.readFile(path.join(__dirname, '../import/' + process.env.FILE));
    let sheet_name_list = workbook.SheetNames;
    //just make sure objects lists are is empty by reimport
    deleteData();
    browserObjects = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {defval: ""});
    summary = {
        objectsTotal: browserObjects.length,
        objectsWithAlias: browserObjects.filter(object=> object['Alias'] !== "").length,
        objectsMatchObjectModels: browserObjects.filter(object=> objectModelsAndTypes.map(({ objectModel }) => objectModel).includes(object['Object Model'])).length,
        objectsMatchNotAllowedStrings: browserObjects.filter(object=> !checkIfItsAnAllowedStringValue(object,notAllowedStrings)).length
    }
    browserObjects.forEach(object=>{
        if(object['Alias'] !== "" && objectModelsAndTypes.map(({ objectModel }) => objectModel).includes(object['Object Model']) &&
            checkIfItsAnAllowedStringValue(object, notAllowedStrings)) {
                let finalObject = {};
                let objectRefPreEdit = object['Object Designation [System1.Management View]'].replace(/System1.ManagementView:|System1.ApplicationView:/g,"");
                finalObject.building = objectRefPreEdit.slice(39, 42);
                finalObject.opcTag = objectRefPreEdit + "." + objectModelsAndTypes.find(item => item.objectModel === object['Object Model']).readProperty;
                finalObject.subsystemType = objectRefPreEdit.slice(43, 46).replace(".","");
                finalObject.dataType = objectModelsAndTypes.find(item => item.objectModel === object['Object Model']).dataType;
                finalObject.unit = object['Main Value.Unit'];
                finalObject.minValue = object['Main Value.Min'];
                finalObject.maxValue = object['Main Value.Max'];
                finalObject.alias = object['Alias'];
                finalObject.description = object['Object Description'];
                filteredObjects.push(finalObject);
            }
    });
    summary.validObjects = filteredObjects.length
    summary.analogValues = filteredObjects.filter(object=> object.dataType === "VT_R8").length
    summary.binaryValues = filteredObjects.filter(object=> object.dataType === "VT_UI4").length
    createClientExcel(getClientList("BAC","B01"),"01");
    createClientExcel(getClientList("BAC","B02"),"02");
    createClientExcel(getClientList("BAC","B03","B05","B06","B07"),"03");
    createClientExcel(getClientList("S7","B06"),"04");
    createClientExcel(getClientList("S7","B01","B02","B03","B04"),"05");
    let wb = XLSX.utils.book_new();
    let managementData = [];
    filteredObjects.filter(object=> object.dataType === "VT_BOOL" || object.dataType === "VT_I4").forEach(object=> {
        object.building = "other";
        object.subsystemType = "desigoCC";
        managementData.push(object);
    });
    let data = XLSX.utils.json_to_sheet(managementData);
    data["!autofilter"] = {ref: "A1:I9"};
    XLSX.utils.book_append_sheet(wb,data, "Client06_Management");
    XLSX.writeFile(wb,path.join( __dirname, '../public/client006.xlsx'));
    importState = true;
}

function getClientList(subsystemType, buildingOption1,buildingOption2, buildingOption3, buildingOption4) {
    if(filteredObjects.length !== 0){
            return filteredObjects.filter(object =>
                (object.building === buildingOption1 ||
                    object.building === buildingOption2 ||
                    object.building === buildingOption3 ||
                    object.building === buildingOption4) &&
                object.subsystemType === subsystemType);
    } else throw new Error("No data imported yet");
}

function createClientExcel(data, clientNumber){
        let wb = XLSX.utils.book_new();
        let data_R8 = XLSX.utils.json_to_sheet(data.filter(object=> object.dataType === "VT_R8"));
        let data_UI4 = XLSX.utils.json_to_sheet(data.filter(object=> object.dataType === "VT_UI4"));
        data_R8["!autofilter"] = {ref: "A1:I9"};
        data_UI4["!autofilter"] = {ref: "A1:I9"};
        XLSX.utils.book_append_sheet(wb,data_R8, "Client" + clientNumber + "_VT_R8");
        XLSX.utils.book_append_sheet(wb,data_UI4,"Client" + clientNumber + " BAC_VT_UI4");
        XLSX.writeFile(wb,path.join( __dirname, '../public/client0' + clientNumber + '.xlsx'));
}

function getDataSummary() {
    return summary;
}

function checkIfItsAnAllowedStringValue(object, notAllowedStrings){
    let callback = true;
    notAllowedStrings.forEach(item=>{
        if (object['Object Designation [System1.Management View]'].includes(item.objectDesignation) && (
            object['Object Description'].includes(item.objectDescriptionOption1) ||
            object['Object Description'].includes(item.objectDescriptionOption2))){
            callback = false;
        }
    })
    return callback;
}

function isImportDone() {
    return importState
}

function deleteData(){
    browserObjects = [];
    filteredObjects = [];
    summary = {};
    importState = false;
}

module.exports = {
    isImportDone,
    readDataFromExcelFile: readDataAndCreateFiles,
    getClientList,
    getDataSummary
}
