// const mysql = require('mysql');
const Koa = require('koa');
// const bodyParser = require('koa-bodyparser');
// const views = require('koa-views')
// const session = require('koa-session-minimal');
// const MysqlStore = require('koa-mysql-session');
// const staticCache = require('koa-static-cache');

const ServerConfig = require('./config/server.config');
const cors = require('@koa/cors');
// var dns = require('dns');
const { port, host, HTTP } = ServerConfig;
const URL = `${HTTP}://${host}:${port}`;
// const config = require('./config/mysql.config.js');
const app = new Koa();
app.use(cors({
  origin: [`${HTTP}://${host}/`],
}))

// dns.resolve('lovemysoul.vip','A', function(e,r) {
//   if (e) console.log(e);
//   else console.log(r);
// });

app.use(require('./routes/article.js').routes());
app.use(require('./routes/dictionary.js').routes());

const koaSwagger = require('koa2-swagger-ui');
// swagger配置
const swagger = require('./config/swagger.config');

app.use(swagger.routes(), swagger.allowedMethods());

app.use(
  koaSwagger({
    routePrefix: '/swagger', // host at /swagger instead of default /docs
    swaggerOptions: {
      url: '/swagger.json' // example path to json
    }
  })
);


app.listen(port);
console.log(`API: ${URL}\nDocs URL: ${URL}/swagger`)
