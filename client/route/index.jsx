import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import shortid from 'shortid';

import TopicList from '@views/TopicList';
import TopicDetail from '@views/TopicDetail';

export default () => [
  <Route path="/" render={() => <Redirect to="/list" />} exact key={shortid.generate()} />,
  <Route path="/list" component={TopicList} key={shortid.generate()} />,
  <Route path="/detail" component={TopicDetail} key={shortid.generate()} />,
];
