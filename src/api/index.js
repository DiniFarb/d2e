const express = require('express');
const router = express.Router();
const path = require('path');
const { readData, createOPCfiles, getData, getSumData } = require('./excelDataHandler');
const serverLog = require('../serverlog/serverlogger');
require('dotenv').config();
console.log(process.env.AUTOIMPORT);
if (process.env.AUTOIMPORT === "YES") {
    serverLog.info("Start auto import ");
    try {
        readData();
    } catch (err) {
        serverLog.error("Auto import: File read error: " + err.message);
    }
} else {
    serverLog.info("Auto import is disabled");
}

router.get('/', async(req, res) => {
    let data = await getSumData();
    res.send({
        data
    });
});

router.get('/impData', async(req, res) => {
    serverLog.info("Get datails for import " + req.query.key);
    let data = await getData(req.query.key);
    console.log(data)
    res.send(
        data[0].value.filteredObjects
    );
});

router.get('/import', (req, res, next) => {
    serverLog.info("Import file from src directory");
    try {
        readData();
        res.status(200).send("Import done and client files created");
    } catch (err) {
        serverLog.error("Import error: " + err.message);
        next(err);
    }
});

router.get('/createOPCfiles', (req, res, next) => {
    serverLog.info("create files for import " + req.body.fileName);
    try {
        createOPCfiles(req.body.fileName);
        res.status(200).send("Import done and client files created");
    } catch (err) {
        serverLog.error("File read error: " + err.message);
        next(err);
    }
});

router.get('/downloadClientList', (req, res, next) => {
    serverLog.info("Get client list client " + JSON.stringify(req.query.clientNumber));
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + 'client' + req.query.clientNumber + ".xlsx"
    );

    try {
        res.download(path.join(__dirname, '../download/client' + req.query.clientNumber + ".xlsx"));
    } catch (err) {
        serverLog.error("download error: " + err.message);
        next(err);
    }
});

router.get('/aliasList', (req, res, next) => {
    serverLog.info("Get alias list ");
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=alias_list.xlsx"
    );

    try {
        res.download(path.join(__dirname, '../download/alias_list.xlsx'));
    } catch (err) {
        serverLog.error("download error: " + err.message);
        next(err);
    }
});


module.exports = router;