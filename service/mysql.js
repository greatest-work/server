const query = require('./query')
const moment = require('moment');

exports.addArticle = (values) => {
    // const id = uuidv4();
    const date = moment().format('YYYY-MM-DD');
    const [ createTime, updateTime ] = [date, date]
    const { title, content, userId, id } = values;
    const _sql = "INSERT INTO ARTICLE SET id=?,createTime=?,updateTime=?,title=?,content=?,userId=?;"
    return query(_sql, [ id, createTime, updateTime,title, content, userId ])
}

exports.getArticles = ( page = 1, pageSize = 10) => {
    const _sql = `SELECT * FROM ARTICLE ORDER BY createTime DESC limit ${(page - 1) * pageSize},${pageSize}`
    return query( _sql)
}

exports.getArticleInfo = id => {
    const _sql = `SELECT * FROM ARTICLE WHERE id = '${id}'`
    return query( _sql)
}

exports.deleteArticle = id => {
    const SQL = `DELETE FROM ARTICLE where id = ${id}`;
    return query(SQL);
}

exports.getSurfaceTotal = (surface) => {
    return query(`SELECT COUNT(*) as count FROM ${surface}`)
}

exports.getDictionary = (key) => {
    const SQL = `SELECT * FROM BLOG_CONFIG WHERE field = '${key}'`;
    return query(SQL);
}
// UPDATE BLOG_CONFIG SET value='/www/wwwroot/blog.giao.club' WHERE field = 'blogPath'