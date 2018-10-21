const asyncBootstrapper = require('react-async-bootstrapper');
const ReactDOMServer = require('react-dom/server');
const ejs = require('ejs');
const serialize = require('serialize-javascript');
const Helmet = require('react-helmet').default;
const SheetsRegistry = require('jss').SheetsRegistry;
const createMuiTheme = require('@material-ui/core/styles/createMuiTheme').default;
const createGenerateClassName = require('@material-ui/core/styles/createGenerateClassName').default;
const color = require('@material-ui/core/colors');
const theme = createMuiTheme({
  palette: {
    primary: {
      light: color.pink[200],
      main: color.lightBlue[700],
      dark: color.lightBlue[700],
      contrastText: '#fff',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

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
  const sheetsRegistry = new SheetsRegistry();
  const sheetsManager = new Map();
  const generateClassName = createGenerateClassName();
  const app = createApp(stores, routerContext, sheetsRegistry, generateClassName, theme, sheetsManager, ctx.url);
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
    link: helmet.link.toString(),
    materialCss: sheetsRegistry.toString()
  })
}
