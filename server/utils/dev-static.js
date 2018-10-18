const path = require('path');
const axios = require('axios');
const proxy = require('koa-proxies');
const webpack = require('webpack');
const serverConfig = require('../../build/webpack.config.server');
const Memory = require('memory-fs');

const serverRender = require('./server-render');

const getTemplate = async () => {
  try {
    const res = await axios.get('http://localhost:8080/public/server.ejs')
    return res.data;
  } catch (err) {
    console.log(err)
  }
}
const NativeModule = require('module');
const vm = require('vm');
const getModuleFromString = (bundle, filename) => {
  const m = { exports: {} };
  const wrapper = NativeModule.wrap(bundle); // 包装可执行JavaScript代码 (function (exports, require, module, __filename, __dirname) {...bundle})
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true,
  });
  const result = script.runInThisContext();  // 指定执行环境
  result.call(m.exports, m.exports, require, m);
  return m;
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

  const m = getModuleFromString(bundle, 'server-entry.js');  // Error: path must be a string (没有指定文件名无法引用)
  serverBundle = m.exports;
})

module.exports = function (app, router) {
  app.use(proxy('/public', {
    target: 'http://localhost:8080'
  }))
  router.get('*', async (ctx, next) => {
    try {
      const template = await getTemplate();
      const html = await serverRender(serverBundle, template, ctx);
      ctx.response.body = html;
    } catch (err) {
      next();
    }
  })
}
