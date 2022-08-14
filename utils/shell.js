const child_process = require('child_process');

module.exports = shell = async (shell) => {
    return new Promise((resolve, reject) => {
        child_process.exec(shell, (error, stdout, stderr) => {
            if (error) {
                console.log(error)
                reject(error)
                return;
            }
            resolve({stdout, stderr})
        });
    })
}