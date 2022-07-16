const controller = require('../service/mysql.js');

module.exports = getSurfaceTotal = async surface => {
    const result = await controller.getSurfaceTotal(surface);
    return result[0].count;
}