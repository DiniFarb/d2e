const serverLog = require('./serverlog/serverlogger');
const path = require('path');
const XLSX = require('xlsx');

const getObjectModelsAndTypes = function (){
        serverLog.info("Read config file ->Valid_Object_Models_and_Types<- for filtering");
        let workbook = XLSX.readFile(path.join(__dirname, './configFiles/Valid_Object_Models_and_Types.xlsx'));
        let sheet_name_list = workbook.SheetNames;
        let objectModelsAndTypes = [];
        XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]).forEach(model=>{
            objectModelsAndTypes.push({
                    objectModel: model["Object Model"],
                    dataType: model["Data Type"]
            });
        });
        return objectModelsAndTypes
}

const getNotAllowedStrings = function (){
        serverLog.info("Read config file ->Not_Allowed_Strings<- for filtering");
        let workbook = XLSX.readFile(path.join(__dirname, './configFiles/Not_Allowed_Strings.xlsx'));
        let sheet_name_list = workbook.SheetNames;
        let objectModelsAndTypes = [];
        XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]).forEach(model=>{
                objectModelsAndTypes.push({
                        objectDesignation: model["Object Designation"],
                        objectDescriptionOption1: model["Object Description Option 1"],
                        objectDescriptionOption2: model["Object Description Option 2"],
                });
        });
        return objectModelsAndTypes
}
module.exports = {
        getObjectModelsAndTypes,
        getNotAllowedStrings
};
