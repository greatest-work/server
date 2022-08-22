const file = require('./fs');
const controller = require('../service/mysql.js');
const shell = require('./shell');
const getSurfaceTotal = require('../service/count');
const { exec, execSync  } = require('child_process');
const getBlogInfo = require('./getBlogInfo')
const sendEmail = require('./sendEmail')

// 发布文章
exports.write = async (data) => {
    return new Promise(async (resolve, reject) => {
        // await file.writeConfigFile();
        // await file.writeFile({id: 'place', content: placeConetent, title: 'place'})
        // await file.writeFile({id: 'index', content: indexConetent, title: 'index'})
        console.log(`开始写入${data.id}`)
        await file.writeFile(data);
        resolve(data)
    })
}

exports.build = async (siteId = null) => {
    const { blogPath, webPath } = await getBlogInfo.path(siteId);
    await file.writeConfigFile(siteId);
    const msg = '编译整包完成'
    return new Promise(async (resolve, reject) => {
        await shell(`cd ${blogPath} && yarn install`).then(async res => {
            console.log("下载依赖完成");
            console.log("开始打包");
            
            try {
                await shell(`cd ${blogPath} && yarn build`)
            } catch (error) {
                reject(error)
            }
            console.log(msg);
            try {
                await shell(`cd ${webPath} && ls -l docs`)
            } catch (error) {
                console.log(error);
                await shell(`cd ${webPath} && mkdir docs`)
            }
            
            await shell(`cd ${webPath} && rm *.html && rm -rf docs`);
            await shell(`cp -r ${blogPath}/.vitepress/dist/* ${webPath}`).then(async res => {
                controller.updateSiteStatus(1, siteId)
                controller.updateArticleStatus(1, { siteId });
                let siteInfo = null
                try {
                    siteInfo = await controller.getSiteInfo(siteId);
                } catch (error) {
                    reject(error)
                }
                resolve({
                    code: 200
                })

                try {
                    const result = await controller.getSystemList();
                    const adminMail = result?.find(item => item.name === 'adminMail');
                    if(!adminMail) return
                    sendEmail({
                        ...siteInfo[0], 
                        email: adminMail?.value, 
                        content: `构建成功！\n <a href="${siteInfo[0].siteLink}">${siteInfo[0].siteLink}</a>`,
                        title: `构建完成`
                    })
                } catch (error) {
                    console.log(`管理员邮箱不存在`);
                }
                
            }).catch(error => {
                reject(error)
            });
        });
    })
}