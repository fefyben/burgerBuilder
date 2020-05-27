import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import Spinner from '../../components/UI/Spinner/Spinner';
import ErrorMessage from '../../components/UI/ErrorMessage/ErrorMessage';

class Orders extends Component {
  componentDidMount() {
    this.props.onFetchOrders(this.props.token, this.props.userId);
  }

  goBackHandler = () => {
    this.props.history.replace('/');
  }

  render() {
    let orders = <Spinner />;
    if (!this.props.error) {
      orders = this.props.orders.map(order => (
        <Order
          key={ order.id }
          ingredients={ order.ingredients }
          deleteOrder={ () => this.props.onDeleteOrder(order.id) }
          price={ +order.price } />
      ));
    } else {
      orders = <ErrorMessage
        message={ this.props.error.message } />;
    }

    return orders;
  }
}

const mapStateToProps = state => {
  return {
    orders: state.order.orders,
    loading: state.order.loading,
    error: state.order.error,
    token: state.auth.token,
    userId: state.auth.user
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId)),
    onDeleteOrder: orderId => dispatch(actions.deleteOrder(orderId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders, axios));
