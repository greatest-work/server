const file = require('./fs');
const controller = require('../service/mysql.js');
const shell = require('./shell');
const getSurfaceTotal = require('../service/count');
const { exec, execSync  } = require('child_process');
const getBlogInfo = require('./getBlogInfo')

// 发布文章
exports.write = async (data) => {
    return new Promise(async (resolve, reject) => {
        await file.writeConfigFile();
        
        const count = await getSurfaceTotal('ARTICLE');
        const articles = await controller.getArticles(1, count);
        // 首页
        let indexConetent = "";
        const indexPageSize = 10;
        // 归档
        let placeConetent = "";
        articles.forEach((article, index) => {
            if(index < indexPageSize) {
                indexConetent += `<a href="/${article.id}.html" >${article.title}</a><br/>`
            }
            placeConetent += `<a href="/${article.id}.html" >${article.title} -- ${article.createTime}</a><br/>`
        });

        // await file.writeFile({id: 'place', content: placeConetent, title: 'place'})
        // await file.writeFile({id: 'index', content: indexConetent, title: 'index'})
        console.log(`开始写入${data.id}`)
        await file.writeFile(data);
        resolve(data)
    })
}

exports.build = async (siteId = null) => {
    const { blogPath, webPath } = await getBlogInfo.path();
    const msg = '编译整包完成'
    return new Promise(async (resolve, reject) => {
        await shell(`cd ${blogPath} && yarn install`).then(async res => {
            console.log("下载依赖完成");
            console.log("开始打包");
            await shell(`cd ${blogPath} && yarn build`).then(res => {
                console.log("打包完成");
            }).catch(err => {
                console.log(err)
            });
            await shell(`cd ${webPath} && rm *.html && rm -rf docs`);
            await shell(`cp -r ${blogPath}/.vitepress/dist/* ${webPath}`).then(res => {
                console.log(msg);
                controller.updateSiteStatus(1, siteId)
                controller.updateArticleStatus(1, siteId);
                resolve({
                    code: 200
                })
            }).catch(err => {
                console.log(err)
            });
        });
    })
}