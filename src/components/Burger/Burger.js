import React from 'react';

import classes from './Burger.module.css';
import BurgerIngredient from './Burgeringredient/Burgeringredient';

const burger = props => {
    // This code use 'ingredients state':
    // it gets the key to use it as the 'type' of ingredient;
    // it gets the value to use it as the quantity of ingredient;
  let transformedIngredients = Object.keys(props.ingredients)
    .map(ingKey => {
      return [ ...Array(props.ingredients[ingKey]) ].map((_, i) => {
        return <BurgerIngredient key={ ingKey + i } type={ ingKey } />;
      });
    })
    // Check if there is any ingredient and show the message to start adding ingredients
    .reduce((arr, el) => {
      return arr.concat(el);
    }, []);

  if (transformedIngredients.length === 0) {
    transformedIngredients = <p>Please, start adding ingredients!</p>;
  }

  return (
    <div className={ classes.BurgerWrapper }>
      <div className={classes.Burger}>
        <BurgerIngredient type="bread-top" />
        { transformedIngredients }
        <BurgerIngredient type="bread-bottom" />
      </div>
    </div>
  );
};

export default burger;
