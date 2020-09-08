const serverLog = require('./serverlog/serverlogger');
const path = require('path');
const XLSX = require('xlsx');

const filterConfig = function (){
        serverLog.info("Read config file for filtering");
        let workbook = XLSX.readFile(path.join(__dirname, './configFiles/Valid_Object_Models.xlsx'));
        let sheet_name_list = workbook.SheetNames;
        let objectModels = [];
        XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]).forEach(model=>{
            objectModels.push(model["Object Model"]);
        });
        return objectModels;
}
module.exports = filterConfig();
