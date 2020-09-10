const path = require('path');
const XLSX = require('xlsx');
const {getNotAllowedStrings , getObjectModelsAndTypes}= require('../importedFilterConfig');
let browserObjects = false;
let filteredObjects = [];

function readDataFromExcelFile() {
    let objectModelsAndTypes = getObjectModelsAndTypes();
    let notAllowedStrings = getNotAllowedStrings();
    let workbook = XLSX.readFile(path.join(__dirname, '../import/' + process.env.FILE));
    let sheet_name_list = workbook.SheetNames;
    //just make sure objects lists are is empty by reimport
    browserObjects = [];
    filteredObjects = [];
    browserObjects = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {defval: ""});
    let summary = {
        objectsWithoutAlias: browserObjects.filter(object=> object['Alias'] !== "").length,
        objectsNotMatchObjectModels: browserObjects.filter(object=> objectModelsAndTypes.map(({ objectModel }) => objectModel).includes(object['Object Model'])).length,
        objectsNotMatchNotAllowedStrings: browserObjects.filter(object=> checkIfItsAnAllowedStringValue(object,notAllowedStrings)).length
    }
    browserObjects.forEach(object=>{
        if(object['Alias'] !== "" && objectModelsAndTypes.map(({ objectModel }) => objectModel).includes(object['Object Model']) &&
            checkIfItsAnAllowedStringValue(object, notAllowedStrings)) {
                object['Data Type'] = objectModelsAndTypes.find(item => item.objectModel === object['Object Model']).dataType;
                filteredObjects.push(object);
            }
    });
    console.log(browserObjects.length);
    console.log(filteredObjects.length);
    console.log(JSON.stringify(summary));
}

function checkIfItsAnAllowedStringValue(object, notAllowedStrings){
    let callback = true;
    notAllowedStrings.forEach(item=>{
        if (item.objectDesignation.includes(object['Object Designation [System1.Management View]']) && (
            item.objectDescriptionOption1.includes(object['Object Description']) ||
            item.objectDescriptionOption1.includes(object['Object Description']))){
            callback = false;
        }
    })
    return callback;
}

function isImportDone() {
    return browserObjects
}

function getFilteredObjectList() {
    if(filteredObjects.length !== 0){
        return filteredObjects
    } else throw new Error("No Filtered object list")
}


module.exports = {
    isImportDone,
    readDataFromExcelFile
}
