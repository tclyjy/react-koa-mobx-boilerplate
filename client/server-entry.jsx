import * as React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider, useStaticRendering } from 'mobx-react';

import JssProvide from 'react-jss/lib/JssProvider';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './views/App';
import { createStoreMap } from './store/index';

// 让mobx在服务端渲染不会重复数据变换
useStaticRendering(true);

export default (stores, routerContext, sheetsRegistry, generateClassName, theme, sheetsManager, url) => (
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <JssProvide registry={sheetsRegistry} generateClassName={generateClassName}>
        <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
          <App />
        </MuiThemeProvider>
      </JssProvide>
    </StaticRouter>
  </Provider>
);

export { createStoreMap };
