const controller = require('../service/mysql.js');
const qs = require('../utils/qs');
const validate = require('../utils/validate');
const resluts = require('../utils/status');
const release = require('../utils//release');
const getSurfaceTotal = require('../service/count')
const { v4: uuidv4 } = require('uuid');

exports.getArticles = async ctx => {
    const { page, pageSize } = qs.get(ctx.request.url);
    const total = await getSurfaceTotal('ARTICLE');
    await controller.getArticles(page, pageSize)
        .then(result => {
            ctx.body = {
                total,
                result
            };
        }).catch((err) => {
            ctx.body = 'error';
        })
}

exports.addArticle = async ctx => {
    const data = await qs.postdata(ctx);
    try {
        await validate(data, {
            title: 'required',
            content: 'required'
        })
    } catch (error) {
        ctx.status = 403;
        return ctx.body = resluts(403);
    }

    // 创建 ID 通用
    data.id = uuidv4();
    await controller.addArticle(data)
        .then(_ => {
            ctx.body = resluts(200);
            action(data)
        }).catch((err) => {
            ctx.body = 'error'
        })
}

const action = async data => {
    await release.write(data);
    await release.build(data);
}

exports.getArticleInfo = async ctx => {
    const data = await qs.postdata(ctx);
    try {
        await validate(data, {
            id: 'required'
        })
    } catch (error) {
        ctx.status = 403;
        return ctx.body = resluts(403);
    }
    await controller.getArticleInfo(data.id)
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

exports.deleteArticle = async ctx => {
    const data = await qs.postdata(ctx);
    try {
        await validate(data, {
            id: 'required'
        })
    } catch (error) {
        ctx.status = 403;
        return ctx.body = {
            code: 403,
            msg: '参数传递不正确'
        }
    }
}

// TODO 需要加上校验 如 密码验证码之类的
// 重新编译
exports.resetBuild = async ctx => {
    // const data = await qs.postdata(ctx);
    const total = await getSurfaceTotal('ARTICLE');
    await controller.getArticles(1, total).then(
        res => {
            res.forEach(async (item, index) => {
                console.log(`(正在重置 ${index + 1}/${total})`);
                await release.write(item);
            })
            ctx.body = { code: 200, msg: '重置模板完毕，正在进行编译' };
            release.build();
        }
    )
}
