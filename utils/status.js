module.exports = resluts = (code, ctx, data) => {
    if(ctx) ctx.status = code;
    const reslut = Object.create(null)
    switch (code) {
        case 400:
            reslut.msg = '参数传递不正确';
            break
        case 401:
            reslut.msg = '认证失败';
            break
        case 403 :
            reslut.msg = '无权限访问';
            break
        case 200:
            reslut.msg = '成功'
            break
        case 204:
            reslut.msg = '删除成功'
            break
        case 201:
            reslut.msg = '新增成功'
            break
        case 500:
            reslut.msg = '服务异常'
            break
    }
    return {
        code,
        ...reslut,
        ...data
    };
}