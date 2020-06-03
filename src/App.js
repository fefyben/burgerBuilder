import React, { useEffect, Suspense, useCallback } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'

import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/Burgeruilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const AboutUs = React.lazy(() => {
  return import('./components/AboutUs/AboutUs');
});

const Auth = React.lazy(() => {
  return import('./containers/Auth/Auth');
});

const Checkout = React.lazy(() => {
  return import('./containers/Checkout/Checkout');
});

const Orders = React.lazy(() => {
  return import('./containers/Orders/Orders');
});

const App = props => {
  const isAuthenticated = useSelector(state => state.auth.token !== null);

  const dispatch = useDispatch();
  const onTryAutoSignin = useCallback(() => dispatch(actions.authCheckState()), [dispatch]);

  useEffect(() => {
    document.title = "BurgerBuilder by Fefy"
    onTryAutoSignin();
  }, [onTryAutoSignin]);

  let routes = (
    <Switch>
      <Route path="/auth" render={ props => <Auth { ...props } /> } />
      <Route path="/about" render={ props => <AboutUs { ...props } /> } />
      <Route path="/" exact component={ BurgerBuilder } />
      <Redirect to="/" />
    </Switch>
  );

  if (isAuthenticated) {
    routes = (
      <Switch>
        <Route path="/checkout" render={ props => <Checkout { ...props } /> } />
        <Route path="/about" redner={ props => <AboutUs { ...props } /> } />
        <Route path="/orders" render={ props => <Orders { ...props } /> } />
        <Route path="/logout" component={ Logout } />
        <Route path="/auth" render={ props => <Auth { ...props } /> } />
        <Route path="/" exact component={ BurgerBuilder } />
        <Redirect to="/" />
      </Switch>
    );
  }

  return <Layout><Suspense fallback={ <p>Loading...</p> }>{routes}</Suspense></Layout>;
};

export default App;
