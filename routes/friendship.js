const router = require('koa-router')();
const friendship = require('../app/friendship');

router.get('/friendship/list', friendship.getFriendshipList);
router.post('/friendship/add', friendship.addFriendship);

module.exports = router