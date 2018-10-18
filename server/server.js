const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const static = require('koa2-static-middleware');
const favicon = require('koa-favicon');
const ReactSSR = require('react-dom/server');
const serverRender = require('./utils/server-render');
const registerRouter = require('./routes')

const isDev = process.env.NODE_ENV === 'development';
const app = new Koa();
app.keys = ['yuanjiayi'];

app.use(session({
  maxAge: 10 * 60 * 1000,
}, app))
app.use(bodyParser());
app.use(favicon(path.join(__dirname, './../', 'favico.ico')))

if (isDev) {
  const devStatic = require('./utils/dev-static');
  devStatic(app, router);
} else {
  const serverEntry = require('../dist/server-entry');
  const template = fs.readFileSync(path.join(__dirname, './../', 'dist/server.ejs'), 'utf8');
  router.get('/public/*', static(path.join(__dirname, './../', 'dist')));
  router.get('*', async (ctx, next) => {
    const html = await serverRender(serverEntry, template, ctx);
    ctx.response.body = html;
  })
}
// log request URL:
app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}`);
  await next();
});

app.use(registerRouter());
app.use(router.routes()).use(router.allowedMethods());

app.listen(3333);
console.log('server is listing in 3333');
