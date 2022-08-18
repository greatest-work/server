const controller = require('../service/mysql.js');
const qs = require('../utils/qs');

// 获取字典表字段
exports.getDictionary = async ctx => {
    const { key } = qs.get(ctx.request.url);
    await controller.getDictionary(key)
        .then(result => {
            ctx.body = result[0];
        }).catch((err) => {
            ctx.body = 'error'
        })
}