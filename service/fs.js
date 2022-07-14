const fs = require('fs'); 
const controller = require('../service/mysql')
const TEMP_BLOG_CONFIG = require('../temp/temp.config.blog');
const TEMP_ARTICLE = require('../temp/temp.article');

exports.writeFile = async data => {
    const { title, content, id } = data;
    let blogPath = ""
    try {
        const resluts =  await controller.getDictionary('blogPath')
        blogPath = resluts[0].value;
    } catch (error) {
        throw error
    }
    // console.log(blogPath)
    const temp = id !== 'index' ? await TEMP_ARTICLE(data) : content;
    console.log(temp);
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

exports.writeConfigFile = async (temp) => {
    const tempConf = await TEMP_BLOG_CONFIG();
    const blogConfig = await controller.getDictionary('blogConfig');

    return new Promise((resolve, reject) => {
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
    })
}