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
// 获取构建日志的详情
exports.getBuildLogInfo = async ctx => {
    const { buildId } = ctx.params;
    try {
        await validate(ctx.params, {
            buildId: 'required'
        })
    } catch (error){
        ctx.body = resluts(400, ctx, { error });
    }
    try {
        console.log(buildId)
        const [ info ] =  await controller.getBuildLogInfo(buildId);
        console.log(info)
        ctx.body = resluts(200, ctx, info);
    } catch (error) {
        ctx.body = resluts(500, ctx, error)
    }
    
}

exports.getBuildLogList = async ctx => {
    try {
        await validate(ctx.query, {
            limit: 'required',
            offset: 'required',
        })
    } catch (error) {
        return ctx.body = resluts(400, ctx);
    }
    const { siteId } = ctx.params;
    const queryInfo = siteId ? `siteId = '${siteId}'` : '';
    const total = await getSurfaceTotal('BUILD_LOG', queryInfo);
    await controller.getBuildLogList({...ctx.query, siteId})
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
const SSEList = {};

exports.buildSSE = async (ctx) => {
    const SSE_KYE = ctx.request.header['x-real-ip']
    SSEList[SSE_KYE] = ctx.sse;
}

const getBuildCL = () => {
    return SSEList
}

exports.getBuildCL = getBuildCL
