const nodemailer = require('nodemailer'); //发送邮件的node插件
const { pass, user } = require('../const/email');

module.exports = sendEmail = (data = {}) => {
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
        subject: `【${data.name}】, ${data.title}`, // 邮件主题
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
