import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'

import asyncComponent from './hoc/asyncComponent/asyncComponent';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/Burgeruilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const asyncAboutUs = asyncComponent(() => {
  return import('./components/AboutUs/AboutUs');
});

const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth');
});

const asyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout');
});

const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders');
});

class App extends Component {
  componentDidMount() {
    document.title = "BurgerBuilder by Fefy"
    this.props.onTryAutoSignin();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/auth" component={ asyncAuth } />
        <Route path="/about" component={ asyncAboutUs } />
        <Route path="/" exact component={ BurgerBuilder } />
        <Redirect to="/" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/checkout" component={ asyncCheckout } />
          <Route path="/about" component={asyncAboutUs} />
          <Route path="/orders" component={ asyncOrders } />
          <Route path="/logout" component={ Logout } />
          <Route path="/auth" component={ asyncAuth } />
          <Route path="/" exact component={ BurgerBuilder } />
          <Redirect to="/" />
        </Switch>
      );
    }
    return (
        <Layout>
          { routes }
        </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignin: () => dispatch(actions.authCheckState())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
