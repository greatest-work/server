const controller = require('../service/mysql.js');
const validate = require('../utils/validate');
const resluts = require('../utils/status');
const tkconf = require('../service/jwtConf');
const md5 = require('md5')
// 创建token
const addtoken = require('../service/addToken.js');
// 解密token
const decodetoken = require('../service/decodeToken');

exports.userLogin = async ctx => {
    const data = ctx.request.body;
    try{
        await validate(data, {
            username: 'required',
            password: 'required'
        })
    } catch(error) {
        return ctx.body = resluts(400, ctx);
    }
    const { username, password, id } = data;
    // 简单的做个 md5 加密
    const md5Username = md5(username);
    const md5Password = md5(password);

    const accessToken = addtoken(id, tkconf.secret, tkconf.tokenLife);
    let user = null
    // 查找数据库的对应用户
    try {
        user = await controller.getUserInfo(md5Username);
    } catch (error) {
        ctx.body = resluts(500, ctx)
    }
    console.log(user, md5Username);
    const res = user?.find(item => item.password === md5Password && item.username === md5Username);
    ctx.body = res ? resluts(200, ctx, { token: accessToken }) : resluts(401, ctx) 
}

exports.userRegister = async ctx => {
    const data = ctx.request.body;
    try{
        await validate(data, {
            username: 'required',
            password: 'required',
            email: 'required',
        })
    } catch(error) {
        return ctx.body = resluts(400, ctx);
    }
    const { username, password, email } = data;
    // 简单的做个 md5 加密
    const md5Username = md5(username);
    const md5Password = md5(password);

    // 查找数据库的对应用户
    const user = await controller.getUserInfo(md5Username);
    if(user?.length) {
        ctx.body = resluts(400, ctx, { msg: '用户名已存在' });
    } else {
        try {
            const queryInfo = {
                username: md5Username,
                password: md5Password,
                email
            }
            await controller.userRegister(queryInfo);
            ctx.body = resluts(201, ctx, { msg: '注册成功' })
        } catch (error) {
            console.log(error);
            ctx.body = resluts(500, ctx);
        }
        // ctx.body = resluts(400, ctx, { msg: '用户名已存在' });
    }

    // ctx.body = res ? resluts(200, ctx, { token: accessToken }) : resluts(401, ctx) 
}