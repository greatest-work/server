const router = require('koa-router')();
const log = require('../app/log');

router.get('/log/list', log.getLog);

module.exports = router