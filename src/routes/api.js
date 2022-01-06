import express from 'express';
import logger from '../logger.js';
import path from 'path';
import { config } from 'dotenv';
import { readData, createOPCfiles, getData, getSumData } from'./excelDataHandler.js';

const router = express.Router();
const __dirname = path.dirname(new URL(import.meta.url).pathname).slice(1);
config();

if (process.env.AUTOIMPORT === 'YES') {
  logger.info('Start auto import ');
  try {
    readData();
  } catch (err) {
    logger.error('Auto import: File read error: ' + err.message);
  }
} else {
  logger.info('Auto import is disabled');
}

router.get('/', async(req, res) => {
  let data = await getSumData();
  res.send({
    data
  });
});

router.get('/impData', async(req, res, next) => {
  logger.info('Get import details ' + req.query.key);
  try {
    const data = await getData(req.query.key);
    res.send(data);
  } catch(err){
    logger.error(`Get import details failed: ${err.message}`);
    next(err);
  }
});

router.get('/import', async(req, res, next) => {
  logger.info('Start file import. . .');
  try {
    readData();
    res.status(200).send('Import done and client files created');
  } catch (err) {
    logger.error(`File import error: ${err.message}`);
    next(err);
  }
});

router.get('/createOPCfiles', async(req, res, next) => {
  logger.info(`Start creating OPC files ${req.query.key}`);
  try {
    await createOPCfiles(req.query.key);
    res.status(200).send('Import done and client files created');
  } catch (err) {
    logger.error(`File import read: ${err.message}`);
    next(err);
  }
});

router.get('/downloadClientList', (req, res, next) => {
  logger.info(`Get client file: ${JSON.stringify(req.query.clientNumber)}`);
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=' + 'client' + req.query.clientNumber + '.xlsx'
  );

  try {
    res.download(path.join(__dirname, '../download/client' + req.query.clientNumber + '.xlsx'));
  } catch (err) {
    logger.error(`Download error: ${err.message}`);
    next(err);
  }
});

router.get('/aliasList', (req, res, next) => {
  logger.info('Get alias file');
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=alias_list.xlsx'
  );
  try {
    res.download(path.join(__dirname, '../download/alias_list.xlsx'));
  } catch (err) {
    logger.error(`Download error: ${err.message}`);
    next(err);
  }
});


export default router;