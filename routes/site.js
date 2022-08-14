const router = require('koa-router')();
const site = require('../app/site');

router.post('/site/add', site.addSite);
router.get('/site/list', site.getSite);
router.get('/site/info', site.getSiteInfo);
router.post('/site/delete/:siteId', site.deleteSite);
module.exports = router