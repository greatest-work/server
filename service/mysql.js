const query = require('../utils/query')
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const xss = require('xss');
const { getSelectSQL, getUpdateSQL, getDeleteSQL, getBatchSQL } = require('../utils/getSQL');
const newDate = () => moment().format('YYYY-MM-DD HH:mm:ss');

// ------------------------------- 文章 -- start ------------------------------- 
exports.addArticle = (values) => {
    const { title, content, userId, id, tags = [], status = 0, siteId } = values;
    const SQL = "INSERT INTO ARTICLE SET id=?,createTime=?,updateTime=?,title=?,content=?,userId=?,tags=?,status=?,siteId=?;"
    return query(SQL, [ id, newDate(), newDate(), title, content, userId, tags.join(), status, siteId])
}

exports.getArticles = ( page = 1, pageSize = 10, siteId) => {
    const queryInfo = {
        table: 'ARTICLE',
        field: ['id', 'createTime', 'updateTime', 'status', 'userId', 'tags', 'siteId', 'title'],
        by: 'createTime',
        where: siteId ? { siteId } : false,
        limit: {
            index: (page - 1) * pageSize,
            size: pageSize
        }
    }
    if(siteId) queryInfo.field.push('content')
    const SQL = getSelectSQL(queryInfo)
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
    return query(SQL);
}

exports.updateArticle = data => {
    const { title, id, content, userId, siteId, status, tags } = data;
    const updateTime = newDate();
    const SQL = `UPDATE ARTICLE 
        SET title=?, content=?, userId=?, siteId=?, status=?, tags=?, updateTime=? 
        WHERE id=?`;
    const values = [ title, xss(content), userId, siteId, status, tags.join(","), updateTime, id ]
    return query(SQL, values);
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
    const { logo = defaultVal.logo, description = '', status = 0, theme = defaultVal.theme, path, name, siteLink} = values;
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
        field: ['username', 'password', 'id'], 
        where: { username } 
    })
    return query(SQL);
}

exports.getUserList = () => {
    const SQL = getSelectSQL({ 
        table: 'USER', 
        field: ['username', 'id'], 
    })
    return query(SQL);
}

exports.userRegister = data => {
    const { username, password, email } = data;
    const SQL = `INSERT INTO USER SET username=?, password=?, email=?, createTime=?, updateTime=?, id=?`;
    return query(SQL, [username, password, email, newDate(), newDate(), uuidv4()]);
}

// ------------------------------- 用户 -- end ------------------------------- 


// ------------------------------- 日志 -- start ------------------------------- 

exports.addLog = data => {
    console.log(data);
    const { ip, userId = "none" , sentence, content, reslut } = data;
    const SQL = `INSERT INTO LOG SET ip=?, time=?, userId=?, sentence=?, content=?, id=?, reslut=?`;
    console.log(SQL);
    return query(SQL, [ip, newDate(), userId, sentence, content, uuidv4(), reslut ]);
}

exports.getLogList = ({limit, offset}) => {
    const queryInfo = {
        table: 'LOG',
        field: ['userId', 'time', 'sentence', 'ip', 'id'],
        limit: {
            index: (offset - 1) * limit,
            size: limit
        },
        by: 'time'
    }
    const SQL = getSelectSQL(queryInfo)
    return query(SQL)
}

exports.addBuildLog = data => {
    const { userId, siteId, id } = data;
    const SQL = `INSERT INTO BUILD_LOG SET id=?, userId=?, siteId=?`;
    console.log(SQL);
    return query(SQL, [id, userId, siteId]);
}

const getBuildLogInfo = id => {
    const SQL = getSelectSQL({ 
        table: 'BUILD_LOG',  
        where: { id } 
    })
    return query(SQL);
}
exports.getBuildLogInfo = getBuildLogInfo

exports.updateBuildLog = async data => {
    const { content, id, status } = data;
    const [ info ] = await getBuildLogInfo(id);
    console.log(info)
    if(!info) return console.log('不存在日志');
    const newContent = !info.content ? content : `${info.content}\n${content}`
    const SQL = `UPDATE BUILD_LOG SET content=?, status=? WHERE id=?`;
    return query(SQL, [newContent, status, id]);
}

exports.getBuildLogList = ({siteId, limit, offset}) => {
    const SQL = getSelectSQL({ 
        table: 'BUILD_LOG', 
        limit: {
            index: (offset - 1) * limit,
            size: limit
        },
        field: ['id', 'startTime', 'status'], 
        by: 'startTime',
        where: { siteId }
    })
    return query(SQL);
}


// ------------------------------- 日志 -- end ------------------------------- 

// ------------------------------- 系统 -- end ------------------------------- 

exports.getSystemList = () => {
    const queryInfo = {
        table: 'SYSTEM',
        field: ['id', 'name', 'value'],
    }
    const SQL = getSelectSQL(queryInfo)
    console.log(SQL);
    return query(SQL)
}

exports.updateSystemList = (data) => {
    const whereList = Object.keys(data);
    const fieldList = Object.values(data)
    const SQL = getBatchSQL({table: 'SYSTEM', where: 'name', whereList, fieldList})
    return query(SQL);
}
// ------------------------------- 系统 -- end ------------------------------- 

exports.getFriendshipList = ({limit, offset, siteId} = {}) => {
    const queryInfo = { 
        table: 'FRIENDSHIP', 
        where: siteId ? { siteId } : undefined 
    }
    if(limit && offset) {
        queryInfo.limit = {
            index: (offset - 1) * limit,
            size: limit
        }
    }
    const SQL = getSelectSQL(queryInfo)
    return query(SQL)
}

exports.addFriendship = ({ name, link, logo, descText, siteId }) => {
    const SQL = `INSERT INTO FRIENDSHIP SET name=?, link=?, logo=?, descText=?, siteId=?, id=?`;
    return query(SQL, [name, link, logo, descText, siteId, uuidv4()]);
}

// exports.userRegister = data => {
//     const { username, password, email } = data;
//     const SQL = `INSERT INTO USER SET username=?, password=?, email=?, createTime=?, updateTime=?, id=?`;
//     return query(SQL, [username, password, email, newDate(), newDate(), uuidv4()]);
// }



exports.getDictionary = (key) => {
    const SQL = `SELECT * FROM BLOG_CONFIG WHERE field = '${key}'`;
    return query(SQL);
}


exports.getSurfaceTotal = (surface, where = '') => {
    const WHERE = where ? `WHERE ${where}` : ''
    const SQL = `SELECT COUNT(*) as count FROM ${surface} ${WHERE}`;
    return query(SQL)
}
