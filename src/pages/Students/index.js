/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import {
  FaUserCircle,
  FaEdit,
  FaWindowClose,
  FaExclamation,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

import { Container } from '../../styles/GlobalStyles';
import { StudentContainer, ProfilePicture } from './styled';
import Loading from '../../components/Loading';

import axios from '../../services/axios';

export default function Students() {
  const [students, setStudents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    async function getData() {
      setIsLoading(true);
      const response = await axios.get('/student');
      setStudents(response.data);
      setIsLoading(false);
    }

    getData();
  }, []);

  const handleDeleteAsk = (e) => {
    e.preventDefault();

    const exclamationButton = e.currentTarget.nextSibling;
    exclamationButton.setAttribute('display', 'block');
    e.currentTarget.remove();
  };

  const handleDelete = async (e, id, index) => {
    e.persist();
    try {
      setIsLoading(true);
      await axios.delete(`/student/${id}`);
      const newStudents = [...students];
      newStudents.splice(index, 1);
      setStudents(newStudents);
      setIsLoading(false);
    } catch (err) {
      const status = get(err, 'response.status', 0);
      if (status === 401) {
        toast.error('Login required!');
      } else {
        toast.error('An error ocurred during delete');
      }

      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <h1> Students </h1>

      <StudentContainer>
        {students.map((student, index) => (
          <div key={String(student.id)}>
            <ProfilePicture>
              {get(student, 'Photos[0].url', '') ? (
                <img src={student.Photos[0].url} alt="" />
              ) : (
                <FaUserCircle size={36} />
              )}
            </ProfilePicture>

            <span>
              {student.name} {student.last_name}
            </span>
            <span>{student.email}</span>

            <Link to={`/student/${student.id}`}>
              <FaEdit size={16} />{' '}
            </Link>

            <Link to={`/student/${student.id}`} onClick={handleDeleteAsk}>
              <FaWindowClose size={16} />
            </Link>

            <FaExclamation
              size={16}
              display="none"
              cursor="pointer"
              onClick={(e) => handleDelete(e, student.id, index)}
            />
          </div>
        ))}
      </StudentContainer>
    </Container>
  );
}
