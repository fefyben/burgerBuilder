import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

const Checkout = () => {
  const ings = useSelector(state => state.burgerBuilder.ingredients);
  const purchased = useSelector(state => state.order.purchased);

  let summary = <Redirect to="/" />;
  if (ings) {
    const purchasedRedirect = purchased ? <Redirect to="/" /> : null;

    summary = (
      <Fragment>
        { purchasedRedirect }
        <CheckoutSummary ingredients={ ings } />
        <ContactData />
      </Fragment>
    );
  }
  return summary;
};

export default Checkout;
