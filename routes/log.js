const router = require('koa-router')();
const log = require('../app/log');

router.get('/log/list', log.getLogList);

module.exports = router