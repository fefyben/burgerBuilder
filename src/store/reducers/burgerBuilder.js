import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  ingredients: null,
  totalPrice: 5,
  ingError: false,
  building: false
}

const INGREDIENT_PRICES = {
  salad: 0.5,
  tomato: 0.5,
  bacon: 1.5,
  cheese: 1,
  meat: 2
}

const addIngredient = (state, action) => {
  const addedIng = { [action.ingredientName]: state.ingredients[action.ingredientName] + 1 };
  const addedIngs = updateObject(state.ingredients, addedIng);
  const updatedAddedState = {
    ingredients: addedIngs,
    totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
    building: true
  };
  return updateObject(state, updatedAddedState);
};

const removeIngredient = (state, action) => {
  const removedIng = { [action.ingredientName]: state.ingredients[action.ingredientName] - 1 };
  const removedIngs = updateObject(state.ingredients, removedIng);
  const updatedRemovedState = {
    ingredients: removedIngs,
    totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
    building: true
  };
  return updateObject(state, updatedRemovedState);
};

const setIngredients = (state, action) => {
  return updateObject(state, {
    ingredients: {
      salad: action.ingredients.salad,
      tomato: action.ingredients.tomato,
      bacon: action.ingredients.bacon,
      cheese: action.ingredients.cheese,
      meat: action.ingredients.meat
    },
    // totalPrice: 6.5,
    // ingError: false,
    // building: false
  });
};

const fetchIngredientsFailed = (state, action) => {
  return updateObject(state, { ingError: true });
};

const reducer = (state=initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_INGREDIENT: return addIngredient(state, action);
    case actionTypes.REMOVE_INGREDIENT: return removeIngredient(state, action);
    case actionTypes.SET_INGREDIENTS: return setIngredients(state, action);
    case actionTypes.FETCH_INGREDIENTS_FAILED: return fetchIngredientsFailed(state, action);
    default: return state;
  }
};

export default reducer;
