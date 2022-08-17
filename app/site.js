const controller = require('../service/mysql.js');
const qs = require('../utils/qs');
const validate = require('../utils/validate');
const resluts = require('../utils/status');
const file = require('../utils/fs');
const shell = require('../utils/shell');
const getSurfaceTotal = require('../service/count')
const { v4: uuidv4 } = require('uuid');

exports.getSite = async ctx => {
    const { page, pageSize } = qs.get(ctx.request.url);
    const total = await getSurfaceTotal('SITE');
    await controller.getSite(page, pageSize)
        .then(async result => {
            for (var i = 0; i < result.length; i++) {
                const { id } = result[i];
                const queryInfo = id ? `siteId = '${id}'` : '';
                result[i].articleTotal = await getSurfaceTotal('ARTICLE', queryInfo);
            }
            ctx.body = resluts(200, ctx, { items: result, total })
        }).catch((err) => {
            ctx.body = 'error';
        })
}

exports.addSite = async ctx => {
    const data = ctx.request.body;
    try {
        await validate(data, {
            name: 'required',
            path: 'required'
        })
    } catch (error) {
        ctx.body = resluts(400, ctx)
    }

    // 创建 ID 通用
    // data.id = uuidv4();
    await controller.addSite(data)
        .then(async _ => {
            try {
                await shell(`mkdir ${data.path}`);
                file.writeInitFile(data, 'index');
            } catch (e) {
                console.log('data.path error', data.path)
                file.writeInitFile(data, 'index');
            }
            ctx.body = resluts(200, ctx);
        }).catch((err) => {
            console.log(err)
            ctx.body = 'error'
        })
}

exports.getSiteInfo = async ctx => {
    const data = ctx.request.body;
    try {
        await validate(data, {
            id: 'required'
        })
    } catch (error) {
        ctx.body = resluts(400, ctx)
    }
    await controller.getSiteInfo(data.id)
        .then(result => {
            let data = {}
            if (result?.length) {
                data = result[0];

            } else {
                data = {
                    code: 200,
                    msg: '暂无数据'
                }
            }
            ctx.body = data
        }).catch((err) => {
            ctx.body = 'error'
        })
}

exports.deleteSite = async ctx => {
    try {
        await validate(ctx.params, {
            siteId: 'required'
        })
        await controller.deleteSite(ctx.params.siteId).then(result => {
            ctx.status = 204;
            ctx.body = resluts(204, ctx)
        }).catch(error => {
            ctx.body = error
        })
    } catch (error) {
        ctx.body = resluts(400, ctx)
    }
}

exports.updateSite = async ctx => {
    const data = ctx.request.body;
    try {
        await validate(data, {
            id: 'required'
        })
        await controller.updateSite(data).then(result => {
            ctx.body = resluts(200, ctx)
        }).catch(error => {
            ctx.body = error
        })
    } catch (error) {
        ctx.body = resluts(400, ctx)
    }
}

