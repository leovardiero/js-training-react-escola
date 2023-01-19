import React from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { FaUserCircle, FaEdit, FaWindowClose } from 'react-icons/fa';

import { Container } from '../../styles/GlobalStyles';
import { StudentContainer, ProfilePicture } from './styled';

import axios from '../../services/axios';

export default function Students() {
  const [students, setStudents] = React.useState([]);

  React.useEffect(() => {
    async function getData() {
      const response = await axios.get('/aluno');
      setStudents(response.data);
    }

    getData();
  }, []);

  return (
    <Container>
      <h1> Students </h1>

      <StudentContainer>
        {students.map((student) => (
          <div key={String(student.id)}>
            <ProfilePicture>
              {get(student, 'Photos[0].url', '') ? (
                <img src={student.Photos[0].url} alt="" />
              ) : (
                <FaUserCircle size={36} />
              )}
            </ProfilePicture>

            <span>{student.nome}</span>
            <span>{student.email}</span>

            <Link to={`/aluno/${student.id}`}>
              <FaEdit size={16} />{' '}
            </Link>
            <Link to={`/aluno/${student.id}`}>
              <FaWindowClose size={16} />{' '}
            </Link>
          </div>
        ))}
      </StudentContainer>
    </Container>
  );
}
