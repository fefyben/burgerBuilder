import { put, delay } from 'redux-saga/effects';
import axios from 'axios';

import * as actions from '../actions';

export function* logoutSaga(action) {
  yield localStorage.removeItem('token');
  yield localStorage.removeItem('expirationDate');
  yield localStorage.removeItem('userId');

  yield put(actions.logoutSucceed());
}

export function* checkAuthTimeOutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(actions.logout());
}

export function* authUserSaga(action) {
  yield put(actions.authStart);
  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true
  }
  let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAQt53XR3fFGoDbNdXqpDGC4iDQxsc12KQ';
  if (!action.isSignup) {
    url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAQt53XR3fFGoDbNdXqpDGC4iDQxsc12KQ';
  }

  try {
    const res = yield axios.post(url, authData)
    const expirationDate = yield new Date(new Date().getTime() + res.data.expiresIn * 1000);
    yield localStorage.setItem('token', res.data.idToken);
    yield localStorage.setItem('expirationDate', expirationDate);
    yield localStorage.setItem('userId', res.data.localId);
    yield put(actions.authSuccess(res.data.idToken, res.data.localId));
    yield put(actions.checkAuthTimeOut(res.data.expiresIn));
  } catch(err) {
    let errMsg = yield err.response.data.error.message;
    if (errMsg === 'EMAIL_EXISTS' ||
      errMsg === 'EMAIL_NOT_FOUND' ||
      errMsg === 'INVALID_PASSWORD') {
      errMsg = 'Email/Password is invalid.';
    } else {
      errMsg = 'Something went wrong. Please try again later.';
    }
    yield put(actions.authFail(errMsg));
  }
}

export function* authCheckStateSaga(action) {
  const token = yield localStorage.getItem('token');
  if (!token) {
    yield put(actions.logout());
  } else {
    const expirationDate = yield new Date(localStorage.getItem('expirationDate'));
    if (expirationDate <= new Date()) {
      yield put(actions.logout());
    } else {
      const userId = yield localStorage.getItem('userId');
      yield put(actions.authSuccess(token, userId));
      yield put(actions.checkAuthTimeOut((expirationDate.getTime() - new Date().getTime()) / 1000));
    }
  }
}
