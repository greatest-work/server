const controller = require('../service/mysql.js');

exports.path = async siteId => {
    const blogPath = process.cwd() + '/blog';
    let webPath = "";
    try {
        if (siteId) {
            const SITE_PATHS = await controller.getSiteInfo(siteId);
            console.log(SITE_PATHS[0].path)
            webPath = SITE_PATHS[0].path;
        } 
    } catch (error) {
        console.log(error)
    }
    console.log('站点根路径' + webPath);
    console.log(blogPath, webPath);
    return {
        blogPath, 
        webPath
    }
}