import logger from './logger.js';
import path from 'path';
import pkg from 'xlsx';
const {readFile,utils} = pkg;
const __dirname = path.dirname(new URL(import.meta.url).pathname).slice(1);

const getObjectModelsAndTypes = function() {
  const filedir = path.join(__dirname, './configFiles/Valid_Object_Models_and_Types.xlsx');
  logger.info(`read config file [Valid_Object_Models_and_Types] from: ${filedir}`);
  try {
    let workbook = readFile(filedir);
    let sheet_name_list = workbook.SheetNames;
    let data = [];
    utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]).forEach(model => {
      data.push({
        objectModel: model['Object Model'],
        dataType: model['Data Type'],
        readProperty: model['Read Property']
      });
    });
    return data;
  } catch (e) {
    throw new Error('file read error on [Valid_Object_Models]:' + e);
  }
};

const getNotAllowedStrings = function() {
  const filedir = path.join(__dirname, './configFiles/Not_Allowed_Strings.xlsx');
  logger.info(`read config file [[Not_Allowed_Strings]] from: ${filedir}`);
  try {
    let workbook = readFile(filedir);
    let sheet_name_list = workbook.SheetNames;
    let data = [];
    utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]).forEach(model => {
      data.push({
        objectDesignation: model['Object Designation'],
        objectDescriptionOption1: model['Object Description Option 1'],
        objectDescriptionOption2: model['Object Description Option 2'],
      });
    });
    return data;
  } catch (e) {
    throw new Error('File read error on Not_Allowed_Strings:' + e);
  }

};
export {
  getObjectModelsAndTypes,
  getNotAllowedStrings
};