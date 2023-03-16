import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { Container } from '../../styles/GlobalStyles';
import Loading from '../../components/Loading';
import { Title, Form } from './styled';
import axios from '../../services/axios';
import history from '../../services/history';
import * as actions from '../../store/modules/auth/actions';

export default function Photos({ match }) {
  const id = get(match, 'params.id', '');
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = React.useState(false);
  const [photo, setPhoto] = React.useState('');

  const handleChange = async (e) => {
    const photoInput = e.target.files[0];
    const photoUrl = URL.createObjectURL(photoInput);

    const formData = new FormData();
    formData.append('student_id', id);
    formData.append('file', photoInput);

    try {
      setIsLoading(true);
      await axios.post('/photo/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Photo uploaded!');
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      const { status } = get(err, 'response.status', '');
      toast.error('An error occured during load the picture');
      if (status === 401) dispatch(actions.loginFailure());
    }

    setPhoto(photoUrl);
  };

  React.useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`student/${id}`);
        setPhoto(get(data, 'Photos[0].url', ''));
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        toast.error('Error during load image');
        history.push('/');
      }
    };

    getData();
  }, []);

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title> Photos </Title>

      <Form>
        <label htmlFor="foto">
          {photo ? <img src={photo} alt="" /> : 'Select Photo'}
          <input type="file" id="foto" onChange={handleChange} />
        </label>
      </Form>
    </Container>
  );
}

Photos.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
