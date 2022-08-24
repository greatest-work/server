const nodemailer = require('nodemailer'); //发送邮件的node插件

const controller = require('../service/mysql.js');

module.exports = sendEmail = async (data = {}) => {
    const systemList = await controller.getSystemList();
    const { value: user } = systemList.find(item => item.name === "sendMail");
    const { value: pass } = systemList.find(item => item.name === "mailPassCode");
    const { value: login } = systemList.find(item => item.name === "loginTip");
    const { value: build } = systemList.find(item => item.name === "buildTip");
    
    if(data.type === "login" && login === "0") return console.log("登录无需发邮件");
    if(data.type === "build" && build === "0") return console.log("构建无需发邮件");
    let transporter = nodemailer.createTransport({
        service: 'QQ', // 发送者的邮箱厂商，支持列表：https://nodemailer.com/smtp/well-known/
        port: 465, // SMTP 端口
        secureConnection: true, // SSL安全链接
        auth: {   //发送者的账户密码
            user, //账户
            pass, //smtp授权码，到邮箱设置下获取
        }
    });
    console.log(data.email)
    let mailOptions = {
        from: `"G-Work" <${user}>`, // 发送者昵称和地址
        to: data.email, // 接收者的邮箱地址
        subject: `【${data.name}】${data.title}`, // 邮件主题
        html: data.content || ''
    };
    //发送邮件
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('邮件发送成功 ID：', info.messageId);
    }); 
}
