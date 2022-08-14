const controller = require('../service/mysql.js');
const qs = require('../utils/qs');
const validate = require('../utils/validate');
const resluts = require('../utils/status');
const release = require('../utils/release');
const shell = require('../utils/shell');
const getSurfaceTotal = require('../service/count');
const getBlogInfo = require('../utils/getBlogInfo');
const { v4: uuidv4 } = require('uuid');

exports.getArticles = async ctx => {
    const { page, pageSize, siteId } = qs.get(ctx.request.url);
    const queryInfo = siteId ? `siteId = '${siteId}'` : '';
    const total = await getSurfaceTotal('ARTICLE', queryInfo);
    await controller.getArticles(page, pageSize, siteId)
        .then(async result => {
            for (var i = 0; i < result.length; i++) {
                const siteInfo = result[i].siteId && await controller.getSiteInfo(result[i].siteId)
                result[i].siteInfo = siteInfo.length ? siteInfo[0] : null
            }
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
            // action(data)
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

exports.updateArticle = async ctx => {
    const data = ctx.request.body
    try {
        await validate(data, {
            title: 'required',
            tags: 'required',
            siteId: 'required'
        })
    } catch (error) {
        ctx.status = 403;
        return ctx.body = resluts(403);
    }
    await controller.updateArticle(data).then(reslut => {
        ctx.body = resluts(200);
    }).catch(error => {
        ctx.body = error;
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
    const { siteId } = ctx.params;
    const queryInfo = siteId ? `siteId = '${siteId}'` : '';
    const total = await getSurfaceTotal('ARTICLE', queryInfo);
    if(!total) {
        return ctx.body = resluts(400)
    }
    try {
        await controller.updateSiteStatus(0, siteId)
        await controller.updateArticleStatus(2, siteId);
    } catch (error) {
        ctx.body = resluts(error)
    }
    console.log(siteId)
    const { blogPath } = await getBlogInfo.path(siteId);
    await shell(`cd ${blogPath} && rm -rf docs && mkdir docs`);
    await controller.getArticles(1, total, siteId).then(
        res => {
            res.forEach(async (item, index) => {
                console.log(`(正在重置 ${index + 1}/${total})`);
                await release.write(item);
            })
            ctx.body = { code: 200, msg: '重置模板完毕，正在进行编译' };
            release.build(siteId);
        }
    )
}
