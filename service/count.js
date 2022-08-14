const controller = require('../service/mysql.js');

module.exports = getSurfaceTotal = async (surface, values) => {
    const result = await controller.getSurfaceTotal(surface, values);
    return result[0].count;
}