const controller = require('../service/mysql.js');
const validate = require('../utils/validate');
const resluts = require('../utils/status');

exports.getFriendshipList = async ctx => {
    await controller.getFriendshipList(ctx.query)
        .then(async items => {
            const queryInfo = ctx.query.siteId ? `siteId = '${ctx.query.siteId}'` : '';
            const total = await getSurfaceTotal('FRIENDSHIP', queryInfo);
            ctx.body = resluts(200, ctx, { items, total})
        }).catch((err) => {
            ctx.body = err;
        })
}

exports.addFriendship = async ctx => {
    const data = ctx.request.body;
    try {
        await validate(data, {
            name: 'required',
            link: 'required',
            logo: 'required',
            descText: 'required',
            siteId: 'required'
        })
    } catch (error) {
        return ctx.body = resluts(400, ctx, { error })
    }
    await controller.addFriendship(data)
        .then(async result => {
            ctx.body = resluts(201, ctx, { result })
        }).catch((error) => {
            ctx.body = resluts(500, ctx, { error });
        })
}
