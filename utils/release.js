const file = require('./fs');
const controller = require('../service/mysql.js');
const shell = require('./shell');
const getSurfaceTotal = require('../service/count')
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

        await file.writeFile({id: 'place', content: placeConetent, title: 'place'})
        await file.writeFile({id: 'index', content: indexConetent, title: 'index'})
        console.log(`开始写入${data.id}`)
        await file.writeFile(data);
        resolve(data)
    })
}

const getBlogPath = async () => {
    let blogPath, webPath = "";
    try {
        const BLOG_PATH = await controller.getDictionary('blogPath');
        blogPath = BLOG_PATH[0].value;
        const WEB_PATH = await controller.getDictionary('webPath');
        webPath = WEB_PATH[0].value;
    } catch (error) {
        reject(error)
    }
    return {
        blogPath, 
        webPath
    }
}

exports.build = async (data) => {
    const { blogPath, webPath } = await getBlogPath();
    const msg = data ? `https://giao.club/${data.id}.html` : '编译整包完成'
    return new Promise(async (resolve, reject) => {
        await shell(`cd ${blogPath} && yarn install`).then(async res => {
            console.log("下载依赖完成");
            console.log("开始打包");
            await shell(`cd ${blogPath} && yarn docs:build`).then(res => {
                console.log("打包完成");
            });
            await shell(`cp -r ${blogPath}/docs/.vitepress/dist/* ${webPath}`).then(res => {
                console.log(msg);
                resolve({
                    code: 200
                })
            })
        });
    })
}