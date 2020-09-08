const express = require('express');
const router = express.Router();
const serverLog = require('../serverlog/serverlogger');
const path = require('path');
const XLSX = require('xlsx');
let browserObjects = {};


router.get('/', (req, res,next) => {
    serverLog.info("Import file from src directory");
    try {
        const objectModels = require('../importedFilterConfig');
        let workbook = XLSX.readFile(path.join(__dirname, '../import/' + process.env.FILE));
        let sheet_name_list = workbook.SheetNames;
        browserObjects = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {defval: ""});
        let filteredObjects = [];
        browserObjects.filter(object=>{
            if(object['Alias'] !== "" && objectModels.includes(object['Object Model'])){

                    filteredObjects.push(object);
            }
        });
        console.log(browserObjects.length);
        console.log(filteredObjects.length);
    } catch (err){
        serverLog.error("File read error: " + err.message);
        next(err);
    }
    res.status(200).send("Import done");
});


module.exports = router;

