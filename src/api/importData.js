const express = require('express');
const router = express.Router();
const serverLog = require('../serverlog/serverlogger');
const readXlsxFile = require('read-excel-file/node');
const path = require('path');
const data = require('../dataHandler/dataHandler');


router.get('/', (req, res) => {
    serverLog.info("import file from src directory");
    // File path.
    readXlsxFile(path.join(__dirname, '../import/source.xlsx')).then((rows) => {
       let contend = new data(rows);
       //....
    })
    res.json({
        message: 'Import'
    });
});


module.exports = router;
