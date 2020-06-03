import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';

const ContactData = props => {
  const [ orderForm, setOrderForm ] = useState({
    name: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your Name'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    street: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your Street'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    zipcode: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your ZIP Code'
      },
      value: '',
      validation: {
        required: true,
        minLength: 5,
        maxLength: 5
      },
      valid: false,
      touched: false
    },
    country: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your Country'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Your E-mail'
      },
      value: '',
      validation: {
        required: true,
        isEmail: true
      },
      valid: false,
      touched: false
    },
    deliveryMethod: {
      elementType: 'select',
      elementConfig: {
        options: [
          { value: 'fastest', displayValue: 'Fastest' },
          { value: 'cheapest', displayValue: 'Cheapest' }
        ]
      },
      value: 'fastest',
      validation: {},
      valid: true
    }
  });
  const [ formIsValid, setFormIsValid ] = useState(false);

  const ings = useSelector(state => state.burgerBuilder.ingredients);
  const price = useSelector(state => state.burgerBuilder.totalPrice);
  const loading = useSelector(state => state.order.loading);
  const token = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.user);

  const dispatch = useDispatch();
  const onOrderBurger = (orderData, token) => dispatch(actions.purchaseBurger(orderData, token));

  const orderHandler = e => {
    e.preventDefault();
    // Get the user data from the form
    const formData = {};
    for (let formElIdentifier in orderForm) {
      formData[formElIdentifier] = orderForm[formElIdentifier].value;
    }

    const order = {
      ingredients: ings,
      price, // in a real app the price should be set on the server side to avoid the user changes it
      contactData: formData,
      userId
    }

    onOrderBurger(order, token);
  };

  const inputChangedHandler = (e, inputIdentifier) => {
    const updatedFormEl = updateObject(orderForm[inputIdentifier], {
      value: e.target.value,
      valid: checkValidity(e.target.value, orderForm[inputIdentifier].validation),
      touched: true
    });

    const updatedOrderForm = updateObject(orderForm, {
      [inputIdentifier]: updatedFormEl
    });

    let validForm = true;
    for (let inputIdentifier in updatedOrderForm) {
      validForm = updatedOrderForm[inputIdentifier].valid && validForm;
    }

    setOrderForm(updatedOrderForm);
    setFormIsValid(validForm);
  };

  const formElsArray = [];
  for (const key in orderForm) {
    formElsArray.push({
      id: key,
      config: orderForm[key]
    });
  }

  let form = (
    <form onSubmit={ orderHandler }>
      { formElsArray.map(formEl => (
        <Input
          key={ formEl.id }
          elementType={ formEl.config.elementType }
          elementConfig={ formEl.config.elementConfig }
          value={ formEl.config.value }
          invalid={ !formEl.config.valid }
          shouldValidate={ formEl.config.validation }
          touched={ formEl.config.touched }
          changed={ e => inputChangedHandler(e, formEl.id) } />
      ))}
      <Button
        btnType="Success"
        disabled={ !formIsValid }>ORDER</Button>
    </form>
  );

  if (loading) form = <Spinner />;

  return (
    <div className={classes.ContactData}>
      <h4>Enter you Contact Data</h4>
      { form }
    </div>
  );
};

export default withErrorHandler(ContactData, axios);
