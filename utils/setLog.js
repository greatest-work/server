const decodetoken = require('../service/decodeToken');
const controller = require('../service/mysql.js');

module.exports = setLog = (ctx, sentence) => {
    const token = ctx.request?.header?.authorization?.replace('Bearer ', '');
    const { userId } = decodetoken(token)
    // const proxyIP = ctx.request.header['x-real-ip'];
    // const referer = ctx.request.header['referer'];
    // const agreement = ctx.request.header['x-forwarded-proto'];
    // const userAgent = ctx.request.header['user-agent'];
    const ip = ctx.request.ips?.join(",");

    controller.addLog({ 
        reslut: ctx.status, 
        sentence: 'build', 
        content: JSON.stringify(ctx.request.header), 
        ip,
        userId
    })
}