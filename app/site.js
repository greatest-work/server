const controller = require('../service/mysql.js');
const qs = require('../utils/qs');
const validate = require('../utils/validate');
const resluts = require('../utils/status');
const file = require('../utils/fs');
const shell = require('../utils/shell');
const getSurfaceTotal = require('../service/count')

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
            return ctx.body = resluts(200, ctx, { items: result, total })
        }).catch((err) => {
            return ctx.body = 'error';
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
        return ctx.body = resluts(400, ctx)
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
            return ctx.body = resluts(200, ctx);
        }).catch((err) => {
            console.log(err)
            return ctx.body = 'error'
        })
}

exports.getSiteInfo = async ctx => {
    const { siteId } = ctx.params;
    if(!siteId) return ctx.body = resluts(400, ctx);
    await controller.getSiteInfo(siteId)
        .then(async result => {
            const articleTotal = await getSurfaceTotal('ARTICLE', `siteId = '${siteId}'`);
            return ctx.body = resluts(200, ctx, { ...result[0], articleTotal })
        }).catch((error) => {
            return ctx.body = resluts(500, ctx, { error })
        })
}

exports.deleteSite = async ctx => {
    try {
        await validate(ctx.params, {
            siteId: 'required'
        })
        await controller.deleteSite(ctx.params.siteId).then(result => {
            return ctx.body = resluts(204, ctx)
        }).catch(error => {
            return ctx.body = resluts(500, ctx, { error })
        })
    } catch (error) {
        return ctx.body = resluts(400, ctx)
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

