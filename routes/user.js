const router = require('koa-router')();
const user = require('../app/user');

router.post('/user/login', user.userLogin);
router.post('/user/register', user.userRegister);
router.get('/user/list', user.getUserList);
module.exports = router