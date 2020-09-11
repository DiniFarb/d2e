const express = require('express');
const router = express.Router();
const {isImportDone, readDataFromExcelFile, getClientList, getDataSummary} = require('./excelDataHandler');
const serverLog = require('../serverlog/serverlogger');


router.get('/', (req, res) => {
    res.json({
        importState: isImportDone() === false ? "No data imported yet😕" : "Yay there is data🤩🦧",
        summary: getDataSummary()
    });
});
//TODO Implement Auto import
router.get('/import', (req, res,next ) => {
    serverLog.info("Import file from src directory");
    try{
        readDataFromExcelFile();
        res.status(200).send("Import done and client files created");
    } catch (err){
        serverLog.error("File read error: " + err.message);
        next(err);
    }
});

router.get('/downloadClientList', (req, res,next ) => {
    serverLog.info("Get client list " + req.params);
    try{
        res.download(__dirname, '../public/download/ ' + req.params.client + ".xlsx");
        res.status(200).json({message: "😉"});
    } catch (err){
        serverLog.error("Client list creation error: " + err.message);
        next(err);
    }
});

module.exports = router;
