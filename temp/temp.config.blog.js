const controller = require('../service/mysql');

module.exports = TEMP_BLOG_CONFIG = async siteId => {
    const [ data ] = await controller.getSiteInfo(siteId);
    console.log(data)
    return new Promise((resolve, reject) => {
        resolve(`module.exports = {
            title: '${data.name}',
            logo: '${data.logo}'
}`)
    })
}