const controller = require('../service/mysql.js');

exports.path = async siteId => {
    const blogPath = process.cwd() + '/blog';
    console.log(siteId, 111)
    let webPath = "";
    try {
        const WEB_PATH = await controller.getDictionary('webPath');
        webPath = WEB_PATH[0].value;
    } catch (error) {
        console.log(error)
    }
    return {
        blogPath, 
        webPath
    }
}