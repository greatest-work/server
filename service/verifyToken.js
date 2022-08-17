const tkconf = require('./jwtConf');
const jwt = require('jsonwebtoken');

module.exports =  function verify_refreshToken(refreshToken) {
    return jwt.verify(refreshToken, tkconf.refreshTokenSecret, (err, decode) => {
        return err ? err : 1
    })
}