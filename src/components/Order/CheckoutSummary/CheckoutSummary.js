import React from 'react';

import classes from './CheckoutSummary.module.css';
import Burger from '../../Burger/Burger';

const checkoutSummary = props => {
  return (
    <div className={ classes.CheckoutSummary }>
      <h1>We hope it tastes well!</h1>
      <div style={{width: '100%', margin: 'auto'}}>
        <Burger ingredients={ props.ingredients }/>
      </div>
    </div>
  );
}

export default checkoutSummary;
