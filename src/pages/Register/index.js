/* eslint-disable react/jsx-no-bind */
import React from 'react';
import { toast } from 'react-toastify';
import { isEmail } from 'validator';

import { get } from 'lodash';
import { Container } from '../../styles/GlobalStyles';
import { Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';
import Loading from '../../components/Loading';

export default function Register() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

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

    if (password.length < 6 || password.length > 50) {
      formErrors = true;
      toast.error('Password must contain between 6 and 50 characters');
    }

    if (formErrors) return;

    setIsLoading(true);
    try {
      await axios.post('/user/', {
        full_name: name,
        password,
        email,
      });
      toast.success('Account created!');
      history.push('/login');
    } catch (err) {
      // const status = get(err, 'response.status', 0);
      const errors = get(err, 'response.data.errors', []);
      errors.map((error) => toast.error(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1> Create New Account </h1>
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
            placeholder="Enter your name"
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

        <button type="submit"> Create Account </button>
      </Form>
    </Container>
  );
}
