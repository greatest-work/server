const jwt = require('jsonwebtoken');
module.exports = (userId,serect,time) => { //创建token并导出
    const token = jwt.sign({
        userId: userId
    }, serect, {expiresIn: time+'s'});
    return token;
};