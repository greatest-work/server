const router = require('koa-router')();
const log = require('../app/log');

router.get('/log/list', log.getLogList);
router.get('/log/build/:buildId/info', log.getBuildLogInfo);

module.exports = router