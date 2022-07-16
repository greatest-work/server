module.exports = resluts = code => {
    switch (code) {
        case 403:
            return {
                code: 403,
                msg: '参数传递不正确'
            }
        case 200:
            return {
                code: 200,
                msg: 'ok'
            }
        default:
            break;
    }
}