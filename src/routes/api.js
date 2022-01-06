import express from 'express';
import logger from '../logger.js';
import path from 'path';
import { config } from 'dotenv';
import { readData, createOPCfiles, getData, getSumData } from'./excelDataHandler.js';

const router = express.Router();
const __dirname = path.dirname(new URL(import.meta.url).pathname);
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

router.get('/impData', async(req, res) => {
  logger.info('Get datails for import ' + req.query.key);
  await getData(req.query.key).then(data => {
    res.json(
      data
    );
  }).catch(err => {
    res.status(500).send({ message: 'Can\'t load data: ' + err });
  });
});

router.get('/import', async(req, res, next) => {
  logger.info('Import file from src directory');
  try {
    await readData();
    res.status(200).send('Import done and client files created');
  } catch (err) {
    logger.error('Import error: ' + err.message);
    next(err);
  }
});

router.get('/createOPCfiles', async(req, res, next) => {
  logger.info('create files for import ' + req.query.key);
  try {
    await createOPCfiles(req.query.key);
    res.status(200).send('Import done and client files created');
  } catch (err) {
    logger.error('File read error: ' + err.message);
    next(err);
  }
});

router.get('/downloadClientList', (req, res, next) => {
  logger.info('Get client list client ' + JSON.stringify(req.query.clientNumber));
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
    logger.error('download error: ' + err.message);
    next(err);
  }
});

router.get('/aliasList', (req, res, next) => {
  logger.info('Get alias list ');
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
    logger.error('download error: ' + err.message);
    next(err);
  }
});


export default router;