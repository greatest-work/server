const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koajwt = require('koa-jwt');
const ServerConfig = require('./config/server.config');
const cors = require('@koa/cors');
const { port, host, HTTP } = ServerConfig;
const URL = `${HTTP}://${host}:${port}`;
const resluts = require('./utils/status');

const app = new Koa();
app.use(bodyParser());
app.proxy = true;
app.use(cors({
  origin: [`${HTTP}://${host}/`],
}))


app.use((ctx, next) => {
  return next().catch(err => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = resluts(401, ctx)
    } else {
      throw err;
    }});
});

app.use(koajwt({
  secret: 'greatest-work-admin'
}).unless({
  path: ['/user/login', '/user/register']
}));


app.use(require('./routes/user.js').routes());
app.use(require('./routes/article.js').routes());
app.use(require('./routes/dictionary.js').routes());
app.use(require('./routes/site.js').routes());
app.use(require('./routes/log.js').routes());
app.use(require('./routes/system.js').routes());
app.use(require('./routes/friendship.js').routes());

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
