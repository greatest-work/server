const child_process = require('child_process');
const controller = require('../service/mysql.js');
const moment = require('moment');
const newDate = () => moment().format('YYYY-MM-DD HH:mm:ss');

module.exports = shell = async (shell, buildId) => {
    controller.updateBuildLog({ content: `[${newDate()}] ${shell}`, id: buildId })
    return new Promise((resolve, reject) => {
        try{
            const sh = child_process.exec(shell, (error, stdout, stderr) => {
                if (error) {
                    console.log(error)
                    reject(error);
                    controller.updateBuildLog({ content: `[${newDate()}] ${error}`, id: buildId, status: 2 })
                }
                resolve({stdout, stderr})
            });
            sh.stdout.on('data', (data) => {
                controller.updateBuildLog({ content: `[${newDate()}] ${data}`, id: buildId, status: 0 })
                console.log(`[data]: ${data}`);
            })
            sh.stderr.on('data', (error) => {
                controller.updateBuildLog({ content: `[${newDate()}] ${error}`, id: buildId,  status: 2  })
                console.log(`[error]: ${error}`);
            })
        } catch (error) {
            controller.updateBuildLog({ content: `[${newDate()}] ${error}`, id: buildId, status: 2 })
            console.log(error);
            reject(error)
        }
    })
}
