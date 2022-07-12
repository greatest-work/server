
module.exports = TEMP_ARTICLE = async (data) => {
    console.log(data);
    return new Promise((resolve, reject) => {
        resolve(`
# ${data.title}

${data.content}
        `)
    })
}