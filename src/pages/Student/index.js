/* eslint-disable no-unused-vars */
import React from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { isEmail, isInt } from 'validator';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FaEdit, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import axios from '../../services/axios';
import history from '../../services/history';
import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture, Title } from './styled';
import Loading from '../../components/Loading';
import * as actions from '../../store/modules/auth/actions';
import 'react-datepicker/dist/react-datepicker.css';

export default function Student({ match }) {
  const id = get(match, 'params.id', '');
  const [name, setName] = React.useState('');
  const [lastname, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [photo, setPhoto] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  // to test
  const [startDate, setStartDate] = React.useState(new Date());

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!id) return;
    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/student/${id}`);
        const Photo = get(data, 'Photos[0].url', '');

        setPhoto(Photo);

        setName(data.name);
        setLastName(data.last_name);
        setEmail(data.email);
        setDob(data.date_of_birth);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);

        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);
        if (status === 400) toast.error('Student not find!');
        history.push('/');
      }
    }

    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    // Prevent default
    e.preventDefault();

    // Field Validations
    let formErrors = false;

    if (name.length < 3 || name.length > 255) {
      formErrors = true;
      toast.error('Name must contain between 3 and 255 characters');
    }

    if (lastname.length < 3 || lastname.length > 255) {
      formErrors = true;
      toast.error('Last Name must contain between 3 and 255 characters');
    }

    if (!isEmail(email)) {
      formErrors = true;
      toast.error('E-mail must be valid');
    }

    if (dob.length !== 8) {
      formErrors = true;
      toast.error('Invalid date of birth');
    }

    if (formErrors) return;

    try {
      setIsLoading(true);
      if (id) {
        // Editing
        await axios.put(`/student/${id}`, {
          name,
          last_name: lastname,
          email,
          date_of_birth: dob,
        });
        toast.success('Student update succesfuly');
      } else {
        // creating
        await axios.post(`/student/`, {
          name,
          last_name: lastname,
          email,
          date_of_birth: dob,
        });
        toast.success('Student created succesfuly');
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      const status = get(err, 'response.status', 0);
      const errors = get(err, 'response.data.errors', []);

      if (errors.length > 0) {
        errors.map(errors.map((error) => toast.error(error)));
      } else {
        toast.error('Unknow erro');
      }

      if (status === 401) dispatch(actions.loginFailure);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />
      <Title> {id ? 'Edit Student' : 'Create new Student'} </Title>

      {id && (
        <ProfilePicture>
          {photo ? <img src={photo} alt={name} /> : <FaUserCircle size={180} />}
          <Link to={`/photo/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}

      <Form onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter the student first name"
          />
        </label>

        <label htmlFor="lastname">
          Last Name:
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter the student last name"
          />
        </label>

        <label htmlFor="email">
          E-mail:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter the student e-mail"
          />
        </label>

        <label htmlFor="dob">
          Date of Birth:
          <input
            type="text"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            placeholder="Enter the student date of birth"
          />
        </label>

        <button type="submit"> {id ? 'Edit' : 'Create'}</button>
      </Form>
    </Container>
  );
}

Student.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
