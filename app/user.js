const controller = require('../service/mysql.js');
const validate = require('../utils/validate');
const resluts = require('../utils/status');
const tkconf = require('../service/jwtConf');
const md5 = require('md5');
const sendEmail = require('../utils/sendEmail')
// 创建token
const addtoken = require('../service/addToken.js');

const getSurfaceTotal = require('../service/count');

exports.userLogin = async ctx => {
    console.log(ctx.request.ip);
    const ip = ctx.request.ips?.join(",")
    const data = ctx.request.body;
    try{
        await validate(data, {
            username: 'required',
            password: 'required'
        })
    } catch(error) {
        return ctx.body = resluts(400, ctx);
    }
    const { username, password } = data;
    // 简单的做个 md5 加密
    // const md5Username = md5(username);
    const md5Password = md5(password);

    let user = null
    // 查找数据库的对应用户
    try {
        user = await controller.getUserInfo(username);
    } catch (error) {
        ctx.body = resluts(500, ctx)
    }
    if(!user.length) return ctx = resluts(401, ctx)
    const res = user?.find(item => {
        return item.password === md5Password && item.username === username
    });
    if(user?.length && res) {
        const accessToken = addtoken(res?.id, tkconf.secret, tkconf.tokenLife);
        ctx.body = resluts(200, ctx, { token: accessToken, email: '' }) 
        controller.addLog({ 
            reslut: ctx.status, 
            sentence: 'login', 
            content: JSON.stringify(data), 
            ip,
            userId: res.id
        })
        try{
            const result = await controller.getSystemList();
            const adminMail = result?.find(item => item.name === 'adminMail');
            if(!adminMail) return
            sendEmail({
                name:'登录通知', 
                email: adminMail.value, 
                content: `登录时间:<b>${new Date()}</b> <br/>
                登录IP：<b>${ip}</b><br/>
                登录账号：<b>${username}</b><br/>
                登录状态：${ctx.status === 200? '成功' : '失败'}`,
                title: `${username}`
            })
        } catch(error) {
            console.log(error);
        }
        
    }else {
        ctx.body = resluts(401, ctx) 
    }
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
    // const md5Username = md5(username);
    const md5Password = md5(password);

    // 查找数据库的对应用户
    const user = await controller.getUserInfo(username);
    if(user?.length) {
        ctx.body = resluts(400, ctx, { msg: '用户名已存在' });
    } else {
        try {
            const queryInfo = {
                username,
                password: md5Password,
                email
            }
            await controller.userRegister(queryInfo);
            ctx.body = resluts(201, ctx, { msg: '注册成功' })
        } catch (error) {
            console.log(error);
            ctx.body = resluts(500, ctx);
        }
    }
}

exports.getUserList = async ctx => {
    try {
        const items = await controller.getUserList();
        const total = await getSurfaceTotal('USER')
        ctx.body = resluts(200, ctx, {
            items,
            total
        })
    } catch (error) {
        ctx.body = resluts(500, ctx, error)
    }
    
}