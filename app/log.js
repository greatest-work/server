const controller = require('../service/mysql.js');
const qs = require('../utils/qs');
const validate = require('../utils/validate');
const resluts = require('../utils/status');
const release = require('../utils/release');
const shell = require('../utils/shell');
const getSurfaceTotal = require('../service/count');
const getBlogInfo = require('../utils/getBlogInfo');
const { v4: uuidv4 } = require('uuid');
const setLog = require('../utils/setLog');

exports.getLogList = async ctx => {
    try {
        await validate(ctx.query, {
            limit: 'required',
            offset: 'required'
        })
    } catch (error) {
        return ctx.body = resluts(400, ctx);
    }
    const total = await getSurfaceTotal('LOG', '');
    await controller.getLogList(ctx.query)
        .then(async result => {
            const data = {
                total,
                items: result
            }
            ctx.body = resluts(200, ctx, data)
        }).catch((err) => {
            ctx.body = err;
        })
}

