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

exports.updateSystemList = async ctx => {
    const data = ctx.request.body;
    await controller.updateSystemList(data)
        .then(async result => {
            ctx.body = resluts(200, ctx, { result })
        }).catch((err) => {
            ctx.body = err;
        })
}