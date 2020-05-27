import React from 'react';

import classes from './BuildControls.module.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
  { label: 'Salad', type: 'salad' },
  { label: 'Tomato', type: 'tomato' },
  { label: 'Bacon', type: 'bacon' },
  { label: 'Cheese', type: 'cheese' },
  { label: 'Meat', type: 'meat' }
];

const buildControls = props => (
  <div className={classes.BuildControls}>
    <p>Current Price: <strong>$ { props.price.toFixed(2) }</strong></p>
    {controls.map(ctrl => {
      return <BuildControl
        key={ ctrl.label }
        label={ ctrl.label }
        more={ () => props.ingredientAdded(ctrl.type) }
        less={ () => props.ingredientRemoved(ctrl.type) }
        disabled={ props.disabled[ctrl.type] } />;
    })}
    <button
      className={ classes.OrderButton }
      disabled={ !props.purchasable }
      onClick={ props.ordered }>{ props.isAuth ? 'ORDER NOW' : 'SIGN UP TO ORDER' }</button>
  </div>
);

export default buildControls;
