import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { lightBlue, pink } from '@material-ui/core/colors';

import App from './views/App';
import { AppState } from './store/appState';

const element = document.getElementById('root');
const initialState = window.__INITIAL__STATE__ || {} // eslint-disable-line

const theme = createMuiTheme({
  palette: {
    primary: {
      light: pink[200],
      main: lightBlue[700],
      dark: lightBlue[700],
      contrastText: '#fff',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

const createApp = (StyleApp) => {
  class Main extends React.Component {
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return <StyleApp />;
    }
  }
  return Main;
};

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    element,
  );
};

render(createApp(App));

if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default; // eslint-disable-line
    render(NextApp);
  });
}
