const qs = require('qs')
/**
 * 获取 url 参数
 * @param {string} url 'http://baidu.com?id=1&name=laowang'
 * @returns 出参 { id: 1, name: 'laowang' }
 */
exports.get = (url) => {
    const index = url.indexOf('?');
    if (index === -1) return {};
    const params = url.slice(index + 1);
    return qs.parse(params);
};
/**
 * 合并url地址和参数 序列化
 * @param {string} url 'http://baidu.com'
 * @param {object} params { id: 1, name: 'laowang' }
 * @returns 出参 'http://baidu.com?id=1&name=laowang'
 */
exports.join = (url, params) => {
    const index = url.indexOf('?');
    if (index !== -1) {
        url = url.slice(0, index);
    }
    if (JSON.stringify(params) == '{}') return url;
    return `${url}?${qs.stringify(params)}`;
};

exports.postdata = (ctx) => {
    return new Promise((resolve, reject) => {
        try {
            let postdata = "";
            ctx.req.addListener('data', (data) => {
                postdata += data
            })
            
            ctx.req.addListener("end", function () {
                let parseData = parseQueryStr(postdata);
                let result = {};
                Object.keys(parseData).forEach(item => {
                    result = item
                })
                if(result) resolve(JSON.parse(JSON.stringify(result)))
                else reject('qs缺少参数')
            })
        } catch (err) {
            reject(err)
        }
    })
}

// 将POST请求参数字符串解析成JSON
function parseQueryStr(queryStr) {
    let queryData = {}
    let queryStrList = queryStr.split('&')
    for (let [_, queryStr] of queryStrList.entries()) {
        let itemList = queryStr.split('=')
        queryData[itemList[0]] = decodeURIComponent(itemList[1])
    }
    return queryData
}