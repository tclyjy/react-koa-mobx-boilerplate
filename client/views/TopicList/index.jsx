import * as React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Helmet from 'react-helmet';
import Button from '@material-ui/core/Button';
import { AppState } from '../../store/appState';

@inject('appState')
@observer
class TopicList extends React.Component {
  constructor() {
    super();
    this.changeName = this.changeName.bind(this);
    this.login = this.login.bind(this);
    this.getTopic = this.getTopic.bind(this);
    this.getMessage = this.getMessage.bind(this);
  }

  bootstrap() {
    return new Promise((resolve) => {
      const { appState } = this.props;
      setTimeout(() => {
        appState.count = 3;
        resolve(true);
      });
    });
  }

  getTopic() {
    axios.get('/api/topics').then((res) => {
      console.log(res);
    });
  }

  getMessage() {
    axios.get('/api/messages?needAccessToken=true').then((res) => {
      console.log(res);
    });
  }

  login() {
    axios.post('/api/login', {
      accessToken: '2580a54c-40d5-4e82-bcdf-3a98ede221cb',
    }).then((res) => {
      console.log(res);
    });
  }

  changeName(event) {
    const { appState } = this.props;
    appState.changeName(event.target.value);
  }

  render() {
    const { appState } = this.props;
    return (
      <div>
        <Helmet>
          <title>This is TopicList</title>
          <meta name="descripition" content="This is TopicList" />
        </Helmet>
        <input type="text" onChange={this.changeName} />
        <div>{appState.msg}</div>
        <div>
          <Button variant="contained" color="primary" onClick={this.login}>login</Button>
          <Button variant="contained" color="primary" onClick={this.getTopic}>getTopic</Button>
          <Button variant="contained" color="primary" onClick={this.getMessage}>getMessage</Button>
        </div>
      </div>
    );
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
};

export default TopicList;
