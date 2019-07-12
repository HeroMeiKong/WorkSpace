import CONST from './../config/const';

var locales = [];
locales[CONST.LANGUAGE.EN] = require('./../locales/en.json');
locales[CONST.LANGUAGE.ZH] = require('./../locales/zh.json');

export default locales;