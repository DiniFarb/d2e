const serverLog = require('./serverlog/serverlogger');
const path = require('path');
const XLSX = require('xlsx');

const getObjectModelsAndTypes = function() {
    serverLog.info("Read config file ->Valid_Object_Models_and_Types<- for filtering");
    try {
        let workbook = XLSX.readFile(path.join(__dirname, './configFiles/Valid_Object_Models_and_Types.xlsx'));
        let sheet_name_list = workbook.SheetNames;
        let data = [];
        XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]).forEach(model => {
            data.push({
                objectModel: model["Object Model"],
                dataType: model["Data Type"],
                readProperty: model["Read Property"]
            });
        });
        return data
    } catch (e) {
        throw new Error("File read error on Valid_Object_Models:" + e)
    }
}

const getNotAllowedStrings = function() {
    serverLog.info("Read config file ->Not_Allowed_Strings<- for filtering");
    try {
        let workbook = XLSX.readFile(path.join(__dirname, './configFiles/Not_Allowed_Strings.xlsx'));
        let sheet_name_list = workbook.SheetNames;
        let data = [];
        XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]).forEach(model => {
            data.push({
                objectDesignation: model["Object Designation"],
                objectDescriptionOption1: model["Object Description Option 1"],
                objectDescriptionOption2: model["Object Description Option 2"],
            });
        });
        return data
    } catch (e) {
        throw new Error("File read error on Not_Allowed_Strings:" + e)
    }

}
module.exports = {
    getObjectModelsAndTypes,
    getNotAllowedStrings
};