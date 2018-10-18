const asyncBootstrapper = require('react-async-bootstrapper');
const ReactDOMServer = require('react-dom/server');
const ejs = require('ejs');
const serialize = require('serialize-javascript');
const Helmet = require('react-helmet').default;

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson()
    return result
  }, {})
}

module.exports = async (bundle, template, ctx) => {
  const createStoreMap = bundle.createStoreMap;
  const createApp = bundle.default;
  const routerContext = {};
  const stores = createStoreMap();
  const app = createApp(stores, routerContext, ctx.url);
  await asyncBootstrapper(app);
  const content = ReactDOMServer.renderToString(app);
  if (routerContext.url) {
    ctx.redirect(routerContext.url);
  };
  const state = getStoreState(stores);
  const helmet = Helmet.rewind()
  return ejs.render(template, {
    appString: content,
    initialState: serialize(state),
    meta: helmet.meta.toString(),
    title: helmet.title.toString(),
    style: helmet.style.toString(),
    link: helmet.link.toString()
  })
}
