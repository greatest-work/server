const router = require('koa-router')();
const log = require('../app/log');
const sse = require('koa-sse-stream');
router.get('/log/list', log.getLogList);
router.get('/log/build/:buildId/info', log.getBuildLogInfo);
router.get('/log/build/:siteId/list', log.getBuildLogList);

router.get('/sse/test', sse() , log.buildSSE);

module.exports = router