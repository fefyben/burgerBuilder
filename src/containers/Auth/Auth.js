import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import ErrorMessage from '../../components/UI/ErrorMessage/ErrorMessage';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';

const Auth = props => {
  const [ controls, setControls ] = useState({
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Your Email'
      },
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    password: {
      elementType: 'input',
      elementConfig: {
        type: 'password',
        placeholder: 'Your Password'
      },
      value: '',
      validation: {
        required: true,
        minLength: 6
      },
      valid: false,
      touched: false
    }
  });
  const [ isSignup, setIsSignup ] = useState(true);

  const loading = useSelector(state => state.auth.loading);
  const error = useSelector(state => state.auth.error);
  const isAuthenticated = useSelector(state => state.auth.token !== null);
  const buildingBurger = useSelector(state => state.burgerBuilder.building);
  const authRedirectPath = useSelector(state => state.auth.authRedirectPath);

  const dispatch = useDispatch();
  const onAuth = (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup));
  const onSetAuthRedirectPath = useCallback(() => dispatch(actions.setAuthRedirectPath('/')), [dispatch]);

  useEffect(() => {
    if (!buildingBurger && authRedirectPath !== '/') {
      onSetAuthRedirectPath();
    }
  }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

  const inputChangedHandler = (e, controlName) => {
    const updatedControls = updateObject(controls, {
      [controlName]: updateObject(controls[controlName], {
        value: e.target.value,
        valid: checkValidity(e.target.value, controls[controlName].validation),
        touched: true
      })
    });
    setControls(updatedControls);
  };

  const submitHandler = e => {
    e.preventDefault();
    onAuth(
      controls.email.value,
      controls.password.value,
      isSignup
    );
  };

  const switchAuthModeHandler = () => {
    setIsSignup(!isSignup);
  };

  const formElsArray = [];
  for (let key in controls) {
    formElsArray.push({
      id: key,
      config: controls[key]
    });
  }

  let form = formElsArray.map(formEl => (
    <Input
      key={ formEl.id }
      elementType={ formEl.config.elementType }
      elementConfig={ formEl.config.elementConfig }
      value={ formEl.config.value }
      invalid={ !formEl.config.valid }
      shouldValidate={ formEl.config.validation }
      touched={ formEl.config.touched }
      changed={ e => inputChangedHandler(e, formEl.id) } />
  ));

  if (loading) form = <Spinner />;

  let errorMessage = null;
  if (error) {
    errorMessage = <ErrorMessage message={ error } />;
  }

  let authRedirect = null;
  if (isAuthenticated) {
    authRedirect = <Redirect to={ authRedirectPath } />;
  }

  return (
    <div className={classes.Auth}>
      <h2>{ isSignup ? 'Sign up' : 'Sign in' }</h2>
      { authRedirect }
      { errorMessage }
      <form onSubmit={ submitHandler }>
        { form }
        <Button btnType="Success">Submit</Button>
      </form>
      <Button
        clicked={ switchAuthModeHandler }
        btnType="Danger">Switch to { isSignup ? 'Sign in' : 'Sign up' }</Button>
    </div>
  );
};

export default Auth;
