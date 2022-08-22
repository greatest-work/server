const getWhereSQL = (where = {}) => {
    let where_sql = 'WHERE '
    if(typeof where == 'object') {
        const data = Object.keys(where)
        data.forEach((key, index) => {
            const AND = (index + 1) !== data.length ? 'AND ' : '';
            where_sql += `${key} = '${where[key]}' ${AND}`
        })
    } else {
        return new Error('参数不合法')
    }
    return where_sql;
}

exports.getSelectSQL = ({table, field, where, by = false, bySort = "DESC", limit}) => {
    if(!table) return new Error('参数不合法， table 是必填字段')
    let reslutField = ``;
    if(Array.isArray(field)) {
        field?.forEach((item, index) => {
            if(!item) return
            console.log(item)
            const comma = (index + 1) !== field.length ? ', ' : '';
            console.log(item)
            reslutField += `${table}.${item}${comma}`
        })
    } else reslutField = '*';
    const orderBy = by ? `ORDER BY ${by} ${bySort}` : '';
    if(limit && typeof limit !== 'object') return  new Error('参数不合法， limit 期望是一个对象')
    const limitSql = limit ? `LIMIT ${limit.index}, ${limit.size}` : '';
    const targetWhere = where ? getWhereSQL(where) : '';
    console.log(`SELECT ${reslutField} FROM ${table} ${targetWhere} ${orderBy} ${limitSql}`);
    return `SELECT ${reslutField} FROM ${table} ${targetWhere} ${orderBy} ${limitSql}`
}

exports.getUpdateSQL = ({table, field, where}) => {
    if(!table || !field) return new Error('参数不合法， table field 是必填字段')
    let updateField = ``;
    if(typeof field == 'object' && JSON.stringify(field) !== '{}') {
        const updateData = Object.keys(field)
        updateData.forEach((key, index) => {
            const comma = (index + 1) !== updateData.length ? ', ' : '';
            updateField += `${key} = '${field[key]}'${comma}`
        })
    } else return new Error('参数不合法，field 值不合法，没有期望的更新字段');

    const targetWhere = where ? getWhereSQL(where) : '';
    return `UPDATE ${table} SET ${updateField} ${targetWhere}`;
}

exports.getDeleteSQL = ({table, where}) => {
    if(!table || !where) return new Error('参数不合法， table where 是必填字段')
    const targetWhere = where ? getWhereSQL(where) : '';
    return `DELETE FROM ${table} ${targetWhere}`;
}
