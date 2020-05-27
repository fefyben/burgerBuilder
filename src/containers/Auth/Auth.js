import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import ErrorMessage from '../../components/UI/ErrorMessage/ErrorMessage';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';
import { updateObject, checkValidity } from '../../shared/utility';

class Auth extends Component {
  state = {
    controls: {
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
    },
    isSignup: true
  }

  componentDidMount() {
    if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
      this.props.onSetAuthRedirectPath();
    }
  }

  inputChangedHandler = (e, controlName) => {
    const updatedControls = updateObject(this.state.controls, {
      [controlName]: updateObject(this.state.controls[controlName], {
        value: e.target.value,
        valid: checkValidity(e.target.value, this.state.controls[controlName].validation),
        touched: true
      })
    });
    this.setState({controls: updatedControls});
  };

  submitHandler = e => {
    e.preventDefault();
    this.props.onAuth(
      this.state.controls.email.value,
      this.state.controls.password.value,
      this.state.isSignup
    );
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return { isSignup: !prevState.isSignup };
    });
  }

  render() {
    const formElsArray = [];
    for (let key in this.state.controls) {
      formElsArray.push({
        id: key,
        config: this.state.controls[key]
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
          changed={ e => this.inputChangedHandler(e, formEl.id) } />
    ));

    if (this.props.loading) {
      form = <Spinner />;
    }

    let errorMessage = null;
    if (this.props.error) {
      errorMessage = (
        <ErrorMessage
          message={ this.props.error } />
      );
    }

    let authRedirect = null;
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to={ this.props.authRedirectPath } />;
    }

    return (
      <div className={classes.Auth}>
        <h2>{ this.state.isSignup ? 'Sign up' : 'Sign in' }</h2>
        { authRedirect }
        { errorMessage }
        <form onSubmit={ this.submitHandler }>
          { form }
          <Button btnType="Success">Submit</Button>
        </form>
        <Button
          clicked={ this.switchAuthModeHandler }
          btnType="Danger">Switch to { this.state.isSignup ? 'Sign in' : 'Sign up' }</Button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
    buildingBurger: state.burgerBuilder.building,
    authRedirectPath: state.auth.authRedirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
    onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
