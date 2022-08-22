const router = require('koa-router')();
const system = require('../app/system');

router.get('/system/list', system.getSystemList);

module.exports = router