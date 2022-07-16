module.exports = TEMP_BLOG_CONFIG = async () => {
    const title = "严家辉的博客";
    const lang = "zh-CN";
    const description = "test 博客站点"
    const nav = JSON.stringify([
        { text: '首页', link: '/' },
        { text: '分类', link: '/class' },
        { text: '归档', link: '/place' },
        { text: '友情链接', link: '/friendship' },
    ])
    return new Promise((resolve, reject) => {
        resolve(`
        export default {
            title: "${title}",
            lang: '${lang}',
            description: '${description}',
            themeConfig: {
                nav: ${nav},
            }
        }
        `)
    })
}