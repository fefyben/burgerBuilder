import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import ErrorMessage from '../../components/UI/ErrorMessage/ErrorMessage';

const Orders = props => {
  const orders = useSelector(state => state.order.orders);
  const error = useSelector(state => state.order.error);
  const token = useSelector(state => state.auth.token);
  const userId = useSelector(state => state.auth.user);

  const dispatch = useDispatch();
  const onFetchOrders = useCallback((token, userId) => dispatch(actions.fetchOrders(token, userId)), [dispatch]);
  const onDeleteOrder = orderId => dispatch(actions.deleteOrder(orderId));

  useEffect(() => {
    onFetchOrders(token, userId);
  }, [onFetchOrders, token, userId]);

  let ordersArr = <Spinner />;
  if (!error) {
    ordersArr = orders.map(order => (
      <Order
        key={ order.id }
        ingredients={ order.ingredients }
        deleteOrder={ () => onDeleteOrder(order.id) }
        price={ +order.price } />
    ));
  } else {
    ordersArr = <ErrorMessage message={ error.message } />;
  }

  return ordersArr;
};

export default withErrorHandler(Orders, axios);
