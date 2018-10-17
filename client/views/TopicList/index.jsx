import * as React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import axios from 'axios';
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
      accessToken: '2580a54c-40d5-4e82-bcdf-3a98ede221dc',
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
        <input type="text" onChange={this.changeName} />
        <div>{appState.msg}</div>
        <div>
          <input type="button" onClick={this.login} value="login" />
          <input type="button" onClick={this.getTopic} value="topic" />
          <input type="button" onClick={this.getMessage} value="message" />
        </div>
      </div>
    );
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
};

export default TopicList;
