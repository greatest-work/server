const tkconf = require('./jwtConf');
const jwt = require('jsonwebtoken');

module.exports =  function verify_refreshToken(refreshToken) {
    return jwt.verify(refreshToken, tkconf.secret, (err, decode) => {
        return err ? err : 1
    })
}