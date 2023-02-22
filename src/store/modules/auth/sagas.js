import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';

import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import history from '../../../services/history';

function* loginRequest({ payload }) {
  try {
    const response = yield call(axios.post, '/token', payload);
    yield put(actions.loginSuccess({ ...response.data }));

    toast.success('Login successful');

    axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;
    history.push(payload.prevPath);
  } catch (e) {
    toast.error('Invalid User or Password');

    yield put(actions.loginFailure());
  }
}

function persistRehydrate({ payload }) {
  const token = get(payload, 'auth.token', '');

  if (!token) return;

  axios.defaults.headers.Authorization = `Bearer ${token}`;
}

function* registerRequest({ payload }) {
  const { id, name, email, password } = payload;

  try {
    // if user is logged
    if (id) {
      yield call(axios.put, '/user', {
        email,
        name,
        password: password || undefined,
      });
      toast.success('Account updated!');
      yield put(actions.registerUpdatedSuccess({ name, email }));
    } else {
      yield call(axios.post, '/user', {
        email,
        name,
        password,
      });
      toast.success('Account created!');
      yield put(actions.registerCreatedSuccess({ name, email }));
      history.push('/login');
    }
  } catch (err) {
    const errors = get(err, 'response.data.errors', []);
    const status = get(err, 'response.status', '');

    if (status === 401) {
      toast.error('Session expired! Login again');
      yield put(actions.loginFailure());
      return history.push('/login');
    }

    if (errors.length > 0) {
      errors.map((error) => toast.error(error));
    } else {
      toast.error('Error');
    }

    yield put(actions.registerFailure);
  }

  // to avoid eslint error
  return undefined;
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
]);
