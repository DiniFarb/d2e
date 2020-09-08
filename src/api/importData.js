const express = require('express');
const router = express.Router();
const serverLog = require('../serverlog/serverlogger');
const path = require('path');
const XLSX = require('xlsx');
const browserObjects = [];


router.get('/', (req, res) => {
    serverLog.info("import file from src directory");

    let workbook = XLSX.readFile(path.join(__dirname, '../import/source.xlsx'));
    /* DO SOMETHING WITH workbook HERE */
    console.log(workbook);
    res.json({
        message: 'Import'
    });
});


module.exports = router;
