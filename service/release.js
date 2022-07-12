const file = require('./fs');
const controller = require('../service/mysql.js');
const shell = require('./shell');

// 发布文章
exports.write = async (data) => {
    return new Promise(async (resolve, reject) => {
        await file.writeConfigFile();
        let indexConetent = "# index \n";
        const articles = await controller.getArticles(1, 10);
        articles.forEach(article => {
            indexConetent += `<a href="/${article.id}.html" >${article.title}</a><br/>`
        });
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