module.exports = resluts = code => {
    switch (code) {
        case 400:
            return {
                code: 400,
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