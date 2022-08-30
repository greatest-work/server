const controller = require('../service/mysql');

module.exports = TEMP_BLOG_CONFIG = async siteId => {
    const [ data ] = await controller.getSiteInfo(siteId);
    const [ COMMENT ] = await controller.getComment({
        // for dev only
        siteId: '8f290df2-16a4-489e-ba1b-bf57fd2f6e10'
    });

    const FRIENDSHIP = await controller.getFriendshipList();
    return new Promise((resolve, reject) => {
        resolve(`module.exports = {
    title: '${data.name}',
    logo: '${data.logo}',
    friendship: ${JSON.stringify(FRIENDSHIP)},
    comment: ${JSON.stringify(COMMENT)}}
}`
)
    })
}