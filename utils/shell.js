const child_process = require('child_process');
const controller = require('../service/mysql.js');

module.exports = shell = async (shell, buildId) => {
    console.log(shell)
    return new Promise((resolve, reject) => {
        try{
            const sh = child_process.exec(shell, (error, stdout, stderr) => {
                if (error) {
                    console.log(error)
                    reject(error);
                    controller.updateBuildLog({ content: error, id: buildId })
                }
                controller.updateBuildLog({ content: `[${new Date()}] ${stdout}`, id: buildId })
                console.log(`[data]${stdout}`);
                resolve({stdout, stderr})
            });
            sh.stdout.on('data', (data) => {
                controller.updateBuildLog({ content: `[${new Date()}] ${data}`, id: buildId })
                console.log(`[data]: ${data}`);
            })
            sh.stderr.on('data', (error) => {
                console.log(`[error]: ${error}`);
            })
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}
