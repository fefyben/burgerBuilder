import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions/index';

class BurgerBuilder extends Component {
  state = {
    purchasing: false
  }

  componentDidMount() {
    this.props.onInitIngredients();
  }

  updatePurchaseState(ing) {
    const sum = Object.keys(ing)
      .map(ingKey => {
        return ing[ingKey]; // el
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  purchaseHandler = () => {
    if (this.props.isAuthenticated) {
      this.setState({purchasing: true});
    } else {
      this.props.onSetAuthRedirectPath('/checkout');
      this.props.history.push('/auth');
    }
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
  }

  render() {
    const disabledInfo = { ...this.props.ings };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let burger = this.props.ingError ? <p>Ingredients can't be loaded!</p> : <Spinner />;
    let orderSummary = null;


    if (this.props.ings) {
      burger = (
        <Fragment>
          <Burger ingredients={ this.props.ings } />
          <BuildControls
            ingredientAdded={ this.props.onIngredientAdded }
            ingredientRemoved={ this.props.onIngredientRemoved }
            disabled={ disabledInfo }
            purchasable={ this.updatePurchaseState(this.props.ings) }
            isAuth={ this.props.isAuthenticated }
            ordered={ this.purchaseHandler }
            price={ this.props.price } />
        </Fragment>
      );

      orderSummary = <OrderSummary
        price={ this.props.price.toFixed(2) }
        ingredients={ this.props.ings }
        purchaseCancelled={ this.purchaseCancelHandler }
        purchaseContinued={ this.purchaseContinueHandler } />;
    }

    return (
      <Fragment>
        <Modal
          show={ this.state.purchasing }
          modalClosed={ this.purchaseCancelHandler }>
          { orderSummary }
        </Modal>
        { burger }
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    ingError: state.burgerBuilder.ingError,
    isAuthenticated: state.auth.token
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingName => dispatch(actions.addIngredient(ingName)),
    onIngredientRemoved: ingName => dispatch(actions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path))

  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));