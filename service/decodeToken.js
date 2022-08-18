const jwt = require('jsonwebtoken');

//解密token并导出
module.exports = (token) => {
    const decoded = jwt.decode(token);
    return decoded;
};