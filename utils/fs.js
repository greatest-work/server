const fs = require('fs'); 
const controller = require('../service/mysql');
const TEMP_BLOG_CONFIG = require('../temp/temp.config.blog');
const TEMP_ARTICLE = require('../temp/temp.article');
const TEMP_INIT = require('../temp/temp.init')
const getBlogInfo = require('../utils/getBlogInfo');
const shell = require('../utils/shell');

exports.writeFile = async data => {
    const { title, content, id } = data;

    const { blogPath } = await getBlogInfo.path()
    const temp = id !== 'index' ? await TEMP_ARTICLE(data) : content;
    // console.log(temp);
    return new Promise((resolve, reject) => {
        fs.writeFile(`${blogPath}/docs/${id}.md`, temp, null, function(err) {
            if (err) {
                reject(err)
                throw err;
            }
            console.log(`${data.id}写入成功, time: ${new Date().getTime()}`);
            // 写入成功后读取测试
            fs.readFile(`${blogPath}/docs/${id}.md`, 'utf-8', function(err, data) {
                if (err) {
                    reject(err);
                    throw err;
                }
                const resluts = {
                    title,
                    data
                }
                resolve(resluts);
            });
        });
    })
}


exports.writeInitFile = async (data, fileName) => {
    return new Promise(async (resolve, reject) => {
        const _temp = await TEMP_INIT();
        try {
            await shell(`cd ${data.path} && ls -l ${fileName}.html`);
            await shell(`cd ${data.path} && rm -f ${fileName}.html`);
            fs.writeFile(`${data.path}/${fileName}.html`, _temp[fileName] , null, (err) => {
                if(err) {
                    reject(err)
                } else {
                    resolve('ok')
                }
                
            })
        } catch (err) {
            console.log(err)
            fs.writeFile(`${data.path}/${fileName}.html`, _temp[fileName] , null, (err) => {
                if(err) {
                    reject(err)
                } else {
                    resolve('ok')
                }
                
            })
        }
        
    })
}

exports.writeConfigFile = async siteId => {
    const temp = await TEMP_BLOG_CONFIG(siteId);
    const { blogPath } = await getBlogInfo.path(siteId)
    return new Promise((resolve, reject) => {
        fs.writeFile(`${blogPath}/.vitepress/utils/conf.js`, temp, null, (err) => {
            if(err) {
                reject(err)
            } else {
                resolve('ok')
            }
        })
    })
    // const blogConfig = await controller.getDictionary('blogConfig');

    // return new Promise((resolve) => {
    //   fs.writeFile(`${data.path}/`)  
    // }

        /*
        (resolve, reject) => {
        fs.writeFile(blogConfig[0].value, tempConf, null, function(err) {
            if (err) {
                reject(err)
                throw err;
            }
            console.log(`config.js 写入成功, time: ${new Date().getTime()}`);
            // 写入成功后读取测试
            fs.readFile(blogConfig[0].value, 'utf-8', function(err, data) {
                if (err) {
                    reject(err);
                    throw err;
                }
                const resluts = {
                    data
                }
                resolve(resluts);
            });
        });
    }
        */

}