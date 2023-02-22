/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';
import { useSelector, useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';

export default function Register() {
  const dispatch = useDispatch();

  const id = useSelector((state) => state.auth.user.id);
  const storedName = useSelector((state) => state.auth.user.name);
  const storedEmail = useSelector((state) => state.auth.user.email);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    if (!id) return;

    setName(storedName);
    setEmail(storedEmail);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    let formErrors = false;

    if (name.length < 3 || name.length > 255) {
      formErrors = true;
      toast.error('Name must contain between 3 and 255 characters');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('Invalid E-mail');
    }

    if (!id && (password.length < 6 || password.length > 50)) {
      formErrors = true;
      toast.error('Password must contain between 6 and 50 characters');
    }

    if (formErrors) return;

    dispatch(actions.registerRequest({ name, email, password, id }));
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1> {id ? 'Edit Your Account' : 'Create New Account'} </h1>
      <Form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </label>

        <label htmlFor="email">
          E-mail:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </label>

        <label htmlFor="password">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </label>

        <button type="submit"> {id ? 'Edit' : 'Create'} </button>
      </Form>
    </Container>
  );
}
