const router = require('koa-router')();
const article = require('../app/article');
// #region
/**
 * @swagger
 * /articles?page={page}&pageSize={pageSize}:
 *   get:
 *     summary: 获取文章列表
 *     description: 文章
 *     tags: [ 文章 ]
 *     parameters:
 *       - name: page
 *         description: 页码
 *         in: path
 *         required: false
 *         type: [number, string]
 *       - name: pageSize
 *         description: 页数
 *         in: path
 *         required: false
 *         type: [number, string]
 *     responses:
 *       200:
 *         description: 发布成功
 *       402:
 *          description: 信息填写不全
 *       403:
 *          description: 参数类型错误
 */
// #endregion

router.get('/article/list', article.getArticles);

// #region
/**
 * @swagger
 * /article:
 *   post:
 *     summary: 新增文章
 *     description: 文章
 *     tags: [ 文章 ]
 *     parameters:
 *       - name: title
 *         description: 标题
 *         in: path
 *         required: true
 *         type: string
 *       - name: content
 *         description: 内容
 *         in: path
 *         required: true
 *         type: string
 *       - name: userId
 *         description: 用户 id
 *         in: path
 *         required: true
 *         type: string
 *     requestBody: 
 *       - content: application/json
 *     responses:
 *       200:
 *         description: 发布成功
 *       402:
 *          description: 信息填写不全
 *       403:
 *          description: 参数类型错误
 */
// #endregion
router.post('/article/add', article.addArticle);
router.put('/article/update', article.updateArticle);


router.get('/article/info/:articleId', article.getArticleInfo);
router.delete('/article/delete/:articleId', article.deleteArticle);

router.post('/reset_build/:siteId', article.resetBuild);

module.exports = router