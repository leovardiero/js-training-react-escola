import React from 'react';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import { Title, Paragrafo } from './styled';
import * as exampleActions from '../../store/modules/example/actions';

export default function Login() {
  const dispatch = useDispatch();

  function handleClick(e) {
    e.preventDefault();

    dispatch(exampleActions.clickButtonRequest());
  }

  return (
    <Container>
      <Title>
        Página de Login
        <small> Minitexto</small>
      </Title>
      <Paragrafo> Lorem ipsum dolor sit amed.</Paragrafo>
      <button type="button" onClick={handleClick}>
        {' '}
        Enviar{' '}
      </button>
    </Container>
  );
}
