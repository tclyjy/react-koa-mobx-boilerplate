import * as React from 'react';
import { Link } from 'react-router-dom';
import Routes from '../route';

export default class App extends React.Component {
  componentDidMount() { }

  render() {
    return (
      <div>
        <h1>Hello React</h1>
        <div>
          <Link to="/">首页</Link>
          <Link to="/detail">详情页</Link>
        </div>
        <Routes />
      </div>
    );
  }
}
