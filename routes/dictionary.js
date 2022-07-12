const router = require('koa-router')();
const dictionary = require('../app/dictionary');

router.get('/dictionary', dictionary.getDictionary);
module.exports = router