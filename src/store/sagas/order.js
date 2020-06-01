import { put } from 'redux-saga/effects';

import axios from '../../axios-orders';
import * as actions from '../actions';

export function* purchaseBurgerSaga(action) {
  yield put(actions.purchaseBurgerStart());
  try {
    const res = yield axios.post(`/orders.json?auth=${action.token}`, action.orderData);
    yield put(actions.purchaseBurgerSuccess(res.data.name, action.orderData));
  } catch(err) {
    yield put(actions.purchaseBurgerFail(err));
  }
}

export function* fetchOrdersSaga(action) {
  yield put(actions.fetchOrdersStart());
  const queryParams = yield `?auth=${action.token}&orderBy="userId"&equalTo="${action.userId}"`;
  try {
    const res = yield axios.get(`/orders.json${queryParams}`);
    const fetchedOrders = [];
    for (let key in res.data) {
      fetchedOrders.push({
        ...res.data[key],
        id: key
      });
    }
    yield put(actions.fetchOrdersSuccess(fetchedOrders));
  } catch(err) {
    yield put(actions.fetchOrdersFail(err));
  }
}

export function* deleteOrderSaga(action) {
  try {
    yield axios.delete(`/orders/${action.orderId}.json`);
    yield put(actions.deleteOrderSuccess(action.orderId));
    yield put(actions.fetchOrders());
  } catch(err) {
    yield put(actions.fetchOrdersFail(err));
  }
}
