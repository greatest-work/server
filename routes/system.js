const router = require('koa-router')();
const system = require('../app/system');

router.get('/system/list', system.getSystemList);
router.patch('/system/update', system.updateSystemList);

module.exports = router