const express = require('express');
const router = express.Router();
const {isImportDone, readDataFromExcelFile} = require('./importData');
const serverLog = require('../serverlog/serverlogger');
let lastImportAt = "No import yet"

router.get('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏',
        list: isImportDone() === false ? "NO LIST" : "Yay there is data",
        lastImportAt: lastImportAt
    });
});

router.get('/import', (req, res,next ) => {
    serverLog.info("Import file from src directory");
    try{
        readDataFromExcelFile();
        lastImportAt = new Date();
        res.status(200).send("Import done: " + lastImportAt);
    } catch (err){
        serverLog.error("File read error: " + err.message);
        next(err);
    }
});

module.exports = router;
