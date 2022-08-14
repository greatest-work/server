const query = require('../utils/query')
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const xss = require('xss');

const newDate = () => moment().format('YYYY-MM-DD HH:MM:SS');

exports.addArticle = (values) => {
    const { title, content, userId, id, tags = [], status = 0, siteId } = values;
    const _sql = "INSERT INTO ARTICLE SET id=?,createTime=?,updateTime=?,title=?,content=?,userId=?,tags=?,status=?,siteId=?;"
    return query(_sql, [ id, newDate(), newDate(), title, content, userId, tags.join(), status, siteId])
}

exports.getArticles = ( page = 1, pageSize = 10, siteId) => {
    const WHERE = siteId ? `WHERE siteId='${siteId}'` : '';
    const CONTENT = siteId ? 'ARTICLE.content,' : ''
    const _sql = `SELECT ARTICLE.id, ARTICLE.createTime, ${CONTENT} ARTICLE.updateTime, ARTICLE.status, ARTICLE.title, ARTICLE.userId, ARTICLE.tags, ARTICLE.siteId FROM ARTICLE ${WHERE} ORDER BY createTime DESC LIMIT ${(page - 1) * pageSize},${pageSize}`
    return query( _sql);
}

exports.getArticleInfo = id => {
    const _sql = `SELECT * FROM ARTICLE WHERE id = '${id}'`
    return query(_sql)
}

exports.updateArticleStatus = (target, id) => {
    const SQL = `UPDATE ARTICLE SET status = '${target}' WHERE siteId = '${id}'`;
    return query(SQL)
}

exports.updateArticle = data => {
    const date = Date.now();
    const { title, id, content, userId, siteId, status, tags } = data;
    const CONTENT = content ? `,content='${content}'` : '';
    const SQL = `UPDATE ARTICLE SET title='${title}',updateTime=${date},userId='${userId}',siteId='${siteId}',tags='${tags.join(",")}',status='${status}', updateTime='${newDate()}' ${CONTENT} WHERE id = '${id}'`
    return query(SQL);
}

exports.deleteArticle = id => {
    const SQL = `DELETE FROM ARTICLE where id = '${id}'`;
    return query(SQL);
}

exports.getSurfaceTotal = (surface, where = '') => {
    const WHERE = where ? `WHERE ${where}` : ''
    const SQL = `SELECT COUNT(*) as count FROM ${surface} ${WHERE}`;
    return query(SQL)
}

exports.getDictionary = (key) => {
    const SQL = `SELECT * FROM BLOG_CONFIG WHERE field = '${key}'`;
    return query(SQL);
}

exports.getSiteInfo = id => {
    const SQL = `SELECT * FROM SITE where id = '${id}'`;
    return query(SQL);
}

exports.addSite = (values) => {
    const id = uuidv4();
    const defaultVal = {
        logo: 'https://avatars.githubusercontent.com/u/108932724?s=400&u=b10bf7bb6984b255e81dde608745594edd0266c5&v=4',
        theme: 'default',
        
    }
    const { logo = defaultVal.logo, description = '', status = 1, theme = defaultVal.theme, path, name, siteLink} = values;
    const _sql = "INSERT INTO SITE SET id=?,logo=?,description=?,status=?,theme=?,path=?,name=?, createTime = ?, updateTime = ?, siteLink= ?;"
    console.log(_sql)
    return query(_sql, [ id, logo, description, status, theme, path, name, newDate(), newDate(), siteLink ])
}

exports.getSite = ( page = 1, pageSize = 10) => {
    const _sql = `SELECT * FROM SITE ORDER BY createTime DESC limit ${(page - 1) * pageSize},${pageSize}`
    return query( _sql)
}

exports.getSitePath = siteId => {
    const _sql = `SELECT * FROM SITE WHERE id='${siteId}'`
    return query( _sql);
}

exports.updateSite = (data) => {
    const { logo, description, status, theme, path, name, id, siteLink } = data;
    const SQL = `UPDATE SITE SET logo = '${logo}', description='${description}', path='${path}', name='${name}', siteLink='${siteLink}', updateTime='${newDate()}'  WHERE id = '${id}'`;
    console.log(SQL)
    return query(SQL);
}

exports.updateSiteStatus = (target, id) => {
    const SQL = `UPDATE SITE SET status = '${target}' WHERE id = '${id}'`;
    console.log(SQL)
    return query(SQL);
}

exports.deleteSite = id => {
    const SQL = `DELETE FROM SITE where id = '${id}'`;
    console.log(SQL)
    return query(SQL);
}
// UPDATE BLOG_CONFIG SET value='/www/wwwroot/blog.giao.club' WHERE field = 'blogPath'