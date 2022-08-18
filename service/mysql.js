const query = require('../utils/query')
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const xss = require('xss');
const { getSelectSQL, getUpdateSQL, getDeleteSQL } = require('../utils/getSQL');
const newDate = () => moment().format('YYYY-MM-DD HH:MM:SS');

// ------------------------------- 文章 -- start ------------------------------- 
exports.addArticle = (values) => {
    const { title, content, userId, id, tags = [], status = 0, siteId } = values;
    const SQL = "INSERT INTO ARTICLE SET id=?,createTime=?,updateTime=?,title=?,content=?,userId=?,tags=?,status=?,siteId=?;"
    return query(SQL, [ id, newDate(), newDate(), title, content, userId, tags.join(), status, siteId])
}

exports.getArticles = ( page = 1, pageSize = 10, siteId) => {
    const WHERE = siteId ? `WHERE siteId='${siteId}'` : '';
    const CONTENT = siteId ? 'ARTICLE.content,' : ''
    const SQL = `SELECT ARTICLE.id, ARTICLE.createTime, ${CONTENT} ARTICLE.updateTime, ARTICLE.status, ARTICLE.title, ARTICLE.userId, ARTICLE.tags, ARTICLE.siteId FROM ARTICLE ${WHERE} ORDER BY createTime DESC LIMIT ${(page - 1) * pageSize},${pageSize}`
    return query(SQL);
}

exports.getArticleInfo = id => {
    const SQL = getSelectSQL({table: 'ARTICLE', where: { id }})
    return query(SQL)
}

exports.updateArticleStatus = (status, id) => {
    const where = typeof id === 'string' ? { id } : id;
    const SQL = getUpdateSQL({
        table: 'ARTICLE', 
        field: { status }, 
        where
    })
    console.log(SQL);
    return query(SQL);
    // const SQL = `UPDATE ARTICLE SET status = '${target}' WHERE siteId = '${id}'`;
    // return query(SQL)
}

exports.updateArticle = data => {
    const { title, id, content, userId, siteId, status, tags } = data;
    const SQL = getUpdateSQL({
        table: 'ARTICLE', 
        field: { 
            title, 
            content, 
            userId, 
            siteId, 
            status, 
            tags: tags.join(","),
            updateTime: newDate()
         }, 
        where: { id }
    })
    return query(SQL);
    // const SQL = `UPDATE ARTICLE SET title='${title}',updateTime=${date},userId='${userId}',siteId='${siteId}',tags='${tags.join(",")}',status='${status}', updateTime='${newDate()}' ${CONTENT} WHERE id = '${id}'`
    // return query(SQL);
}

exports.deleteArticle = id => {
    const SQL = getDeleteSQL({ 
        table: 'ARTICLE', 
        where: { 
            id 
        } 
    })
    console.log(SQL);
    return query(SQL);
}

// ------------------------------- 文章 -- end ------------------------------- 


// ------------------------------- 站点 -- start ------------------------------- 

exports.getSiteInfo = id => {
    const SQL = getSelectSQL({
        table: 'SITE', 
        where: { 
            id 
        }
    })
    return query(SQL);
}

exports.addSite = (values) => {
    const id = uuidv4();
    const defaultVal = {
        logo: 'https://avatars.githubusercontent.com/u/108932724?s=400&u=b10bf7bb6984b255e81dde608745594edd0266c5&v=4',
        theme: 'default',
    }
    const { logo = defaultVal.logo, description = '', status = 1, theme = defaultVal.theme, path, name, siteLink} = values;
    const SQL = "INSERT INTO SITE SET id=?,logo=?,description=?,status=?,theme=?,path=?,name=?, createTime = ?, updateTime = ?, siteLink= ?;"
    return query(SQL, [ id, logo, description, status, theme, path, name, newDate(), newDate(), siteLink ])
}

exports.getSite = ( page = 1, pageSize = 10) => {
    const SQL = `SELECT * FROM SITE ORDER BY createTime DESC limit ${(page - 1) * pageSize},${pageSize}`
    return query(SQL)
}

exports.updateSite = (data) => {
    const { logo, description, status, theme = "", path, name, id, siteLink } = data;
    const queryInfo = {
        logo, 
        description, 
        status, 
        theme, 
        path, 
        name, 
        siteLink,
        updateTime: newDate()
    }
    const SQL = getUpdateSQL({
        table: 'SITE', 
        field: queryInfo, 
        where: { id }
    })
    return query(SQL);
}

exports.updateSiteStatus = (status, id) => {
    const where = typeof id === 'string' ? { id } : id;
    const SQL = getUpdateSQL({
        table: 'SITE', 
        field: { status }, 
        where
    })
    console.log(SQL);
    return query(SQL);
}

exports.deleteSite = id => {
    const SQL = getDeleteSQL({ 
        table: 'SITE', 
        where: { 
            id 
        } 
    })
    return query(SQL);
}
// ------------------------------- 站点 -- end -------------------------------


// ------------------------------- 用户 -- start ------------------------------- 

exports.getUserInfo = username => {
    const SQL = getSelectSQL({ 
        table: 'USER', 
        field: ['username', 'password'], 
        where: { username: username } 
    })
    return query(SQL);
}

exports.userRegister = data => {
    const { username, password, email } = data;
    const SQL = `INSERT INTO USER SET username=?, password=?, email=?, createTime=?, updateTime=?, id=?`;
    return query(SQL, [username, password, email, newDate(), newDate(), uuidv4()]);
}

// ------------------------------- 用户 -- end ------------------------------- 


exports.getDictionary = (key) => {
    const SQL = `SELECT * FROM BLOG_CONFIG WHERE field = '${key}'`;
    return query(SQL);
}


exports.getSurfaceTotal = (surface, where = '') => {
    const WHERE = where ? `WHERE ${where}` : ''
    const SQL = `SELECT COUNT(*) as count FROM ${surface} ${WHERE}`;
    return query(SQL)
}
