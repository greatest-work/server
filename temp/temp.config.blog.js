module.exports = TEMP_BLOG_CONFIG = async () => {
    const title = "严家辉的博客";
    return new Promise((resolve, reject) => {
        resolve(`
        export default {
            title: "${title}",
            description: 'Just playing around.',
            themeConfig: {
                nav: [
                  
                ]
            }
        }
        `)
    })
}