const path = require('path');
const axios = require('axios');
const proxy = require('koa-proxies');
const webpack = require('webpack');
const serverConfig = require('../../build/webpack.config.server');
const Memory = require('memory-fs');
const asyncBootstrapper = require('react-async-bootstrapper');
const ReactDOMServer = require('react-dom/server');
const ejs = require('ejs');
const serialize = require('serialize-javascript')

const getTemplate = async () => {
  try {
    const res = await axios.get('http://localhost:8080/public/server.ejs')
    return res.data;
  } catch (err) {
    console.log(err)
  }
}
const memory = new Memory();
const serverCompiler = webpack(serverConfig);
serverCompiler.outputFileSystem = memory; // 内存写入bundle

let serverBundle, createStoreMap;
serverCompiler.watch({}, (err, states) => {
  if (err) throw err;
  states = states.toJson();
  states.errors.forEach(err => console.error(err));
  states.warnings.forEach(warn => console.warn(warn));

  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename);
  const bundle = memory.readFileSync(bundlePath, 'utf-8'); // 内存读取bundle

  /**
   *  hack
   *  bundle 是JS文件 通过module._compile转换成nodeJs引入方式
   */
  const Module = module.constructor;
  const m = new Module();
  m._compile(bundle, 'server-entry.js');  // Error: path must be a string (没有指定文件名无法引用)
  serverBundle = m.exports.default;
  createStoreMap = m.exports.createStoreMap;
})

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = function (app, router) {
  app.use(proxy('/public', {
    target: 'http://localhost:8080'
  }))
  router.get('*', async (ctx, next) => {
    const template = await getTemplate();
    console.log(template);
    const routerContext = {};
    const stores = createStoreMap();
    const app = serverBundle(stores, routerContext, ctx.url);
    await asyncBootstrapper(app);
    const content = ReactDOMServer.renderToString(app);
    if (routerContext.url) {
      ctx.redirect(routerContext.url);
    };
    const state = getStoreState(stores);
    ctx.response.body = ejs.render(template, {
      appString: content,
      initialState: serialize(state)
    })
  })
}
