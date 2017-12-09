import React from 'react';
import reactDom from 'react-dom';
import './css/responsive.scss';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import {createLogger} from 'redux-logger';
import Reducers from './section/Reducers';

import Home from './views/Home';
import * as urlConstants from './section/constants/urlConstants';
import PageNotFound from './views/PageNotFound';

var ReactRouter = require('react-router-dom');
var Router = ReactRouter.BrowserRouter;
var Route = ReactRouter.Route;
var Switch = ReactRouter.Switch;

const logger = createLogger();
const store = createStore(
  Reducers,
  applyMiddleware(thunk, promise, logger)
);

class App extends React.Component {
  render() {
    return (
      <div>
        <Provider store={store}>        
          <Router>
            <Switch>
              <Route exact path={urlConstants.urls.home.path} component={Home} />
              <Route path='*' component={PageNotFound} />
            </Switch>
          </Router>
        </Provider>
      </div>
    );
  }
}

reactDom.render(
  <App />, document.getElementById('app')
);