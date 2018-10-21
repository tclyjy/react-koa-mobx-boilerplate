import * as React from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Routes from '../route';

export default class App extends React.Component {
  componentDidMount() { }

  render() {
    return (
      <div>
        <Typography variant="h1" gutterBottom>Hello React</Typography>
        <div>
          <Link to="/">首页</Link>
          <Link to="/detail">详情页</Link>
        </div>
        <Routes />
      </div>
    );
  }
}
