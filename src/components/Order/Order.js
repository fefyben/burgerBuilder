import React from 'react';

import classes from './Order.module.css';
import Button from '../UI/Button/Button';

const order = props => {
  const ingredientsList = [];
  for (let ingredientName in props.ingredients) {
    ingredientsList.push({
      name: ingredientName,
      amount: props.ingredients[ingredientName]
    });
  }

  const ingredientOutput = ingredientsList.map(ig => {
    return <span
      style={{
        textTransform: 'capitalize',
        display: 'inline-block',
        margin: '0 2px',
        padding: '5px 8px',
        border: '1px solid #ccc'
      }}
      key={ ig.name }>{ ig.name } ({ ig.amount })</span>
  });

  return (
    <div className={ classes.Order }>
      <p>Ingredients: { ingredientOutput }</p>
      <p>Price: <strong>${ props.price.toFixed(2) }</strong></p>
      <div className={ classes.Actions }>
        <Button
          btnType='Danger'
          clicked={ props.deleteOrder }>Delete</Button>
      </div>
    </div>
  );
}

export default order;
