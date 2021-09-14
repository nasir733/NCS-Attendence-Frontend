import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './containers/Home';
import Login from './containers/Login';
import Signup from './containers/Signup';
import Activate from './containers/Activate';
import ResetPassword from './containers/ResetPassword';
import ResetPasswordConfirm from './containers/ResetPasswordConfirm';
import { ToastContainer, toast } from "react-toastify";

import { Provider } from 'react-redux';
import store from './store';

import Layout from './hocs/Layout';
import Facerecognition from "./containers/Facerecognition";

const App = () => (
  <Provider store={store}>
    <ToastContainer />
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/reset_password" component={ResetPassword} />
          <Route
            exact
            path="/password/reset/confirm/:uid/:token"
            component={ResetPasswordConfirm}
          />
          <Route exact path="/activate/:uid/:token" component={Activate} />
          <Route exact path="/attendence" component={Facerecognition} />
        </Switch>
      </Layout>
    </Router>
  </Provider>
);

export default App;
