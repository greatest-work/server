const controller = require('../service/mysql.js');
const resluts = require('../utils/status');

exports.getSystemList = async ctx => {
    await controller.getSystemList()
        .then(async result => {
            ctx.body = resluts(200, ctx, { result })
        }).catch((err) => {
            ctx.body = err;
        })
}
