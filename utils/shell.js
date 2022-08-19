const child_process = require('child_process');

module.exports = shell = async (shell) => {
    console.log(shell)
    return new Promise((resolve, reject) => {
        try{
            child_process.exec(shell, (error, stdout, stderr) => {
                if (error) {
                    console.log(error)
                    reject(error);
                }
                resolve({stdout, stderr})
            });
        } catch (error) {
            console.log(error);
            reject(error)
        }
    })
}