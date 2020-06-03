import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';

const BurgerBuilder = props => {
  const [purchasing, setPurchasing ] = useState(false);

  const ings = useSelector(state => state.burgerBuilder.ingredients);
  const price = useSelector(state => state.burgerBuilder.totalPrice);
  const ingError = useSelector(state => state.burgerBuilder.ingError);
  const isAuthenticated = useSelector(state => state.auth.token);

  const dispatch = useDispatch();
  const onIngredientAdded = ingName => dispatch(actions.addIngredient(ingName));
  const onIngredientRemoved = ingName => dispatch(actions.removeIngredient(ingName));
  const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
  const onInitPurchase = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = path => dispatch(actions.setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const updatePurchaseState = ing => {
    const sum = Object.keys(ing)
      .map(ingKey => {
        return ing[ingKey]; // el
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  };

  const purchaseHandler = () => {
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
  };

  const purchaseCancelHandler = () => setPurchasing(false);

  const purchaseContinueHandler = () => {
    onInitPurchase();
    props.history.push('/checkout');
  };

  const disabledInfo = { ...ings };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }

  let burger = ingError ? <p>Ingredients can't be loaded!</p> : <Spinner />;
  let orderSummary = null;

  if (ings) {
    burger = (
      <Fragment>
        <Burger ingredients={ ings } />
        <BuildControls
          ingredientAdded={ onIngredientAdded }
          ingredientRemoved={ onIngredientRemoved }
          disabled={ disabledInfo }
          purchasable={ updatePurchaseState(ings) }
          isAuth={ isAuthenticated }
          ordered={ purchaseHandler }
          price={ price } />
      </Fragment>
    );

    orderSummary = <OrderSummary
      price={ price.toFixed(2) }
      ingredients={ ings }
      purchaseCancelled={ purchaseCancelHandler }
      purchaseContinued={ purchaseContinueHandler } />;
  }

  return (
    <Fragment>
      <Modal
        show={ purchasing }
        modalClosed={ purchaseCancelHandler }>
        { orderSummary }
      </Modal>
      { burger }
    </Fragment>
  );
};

export default withErrorHandler(BurgerBuilder, axios);
