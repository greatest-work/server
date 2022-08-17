const getWhereSQL = function(where = {}) {
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

exports.getSelectSQL = ({table, field, where}) => {
    if(!table) return new Error('参数不合法， table 是必填字段')
    let reslutField = '';
    if(Array.isArray(field)) {
        field?.forEach((item, index) => {
            if(!item) return
            const comma = (index + 1) !== field.length ? ', ' : '';
            reslutField += `${table}.${item}${comma}`
        })
    } else reslutField = '*'
    const targetWhere = where ? getWhereSQL(where) : '';
    return `SELECT ${reslutField} FROM ${table} ${targetWhere}`
}

exports.getUpdateSQL = ({table, field, where}) => {
    if(!table || !field) return new Error('参数不合法， table field 是必填字段')
    let updateField = '';
    if(typeof field == 'object' && JSON.stringify(field) !== '{}') {
        const updateData = Object.keys(field)
        updateData.forEach((key, index) => {
            if(!field[key]) return
            const comma = (index + 1) !== updateData.length ? ', ' : '';
            updateField += `${key} = '${field[key]}'${comma}`
        })
    } else return new Error('参数不合法，field 值不合法，没有期望的更新字段');

    const targetWhere = where ? getWhereSQL(where) : '';
    return `UPDATE ${table} SET ${updateField} ${targetWhere}`;
}

 