const express = require('express');
const router = express.Router();
const path = require('path');
const {isImportDone, readDataFromExcelFile, getClientList, getDataSummary} = require('./excelDataHandler');
const serverLog = require('../serverlog/serverlogger');
require('dotenv').config();

if(process.env.AUTOIMPORT){
serverLog.info("Start auto import");
try{
    readDataFromExcelFile();
} catch (err){
    serverLog.error("Auto import: File read error: " + err.message);
}
} else {
    serverLog.info("Auto import is disabled");
}

router.get('/', (req, res) => {
    res.json({
        importState: isImportDone(),
        summary: getDataSummary()
    });
});


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
    serverLog.info("Get client list client " + JSON.stringify(req.query.clientNumber));
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + 'client' + req.query.clientNumber + ".xlsx"
    );

    try{
        res.download(path.join(__dirname, '../public/client' + req.query.clientNumber + ".xlsx"));
    } catch (err){
        serverLog.error("download error: " + err.message);
        next(err);
    }
});

router.get('/aliasList', (req, res,next ) => {
    serverLog.info("Get alias list ");
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=alias_list.xlsx"
    );

    try{
        res.download(path.join(__dirname, '../public/alias_list.xlsx'));
    } catch (err){
        serverLog.error("download error: " + err.message);
        next(err);
    }
});


module.exports = router;
