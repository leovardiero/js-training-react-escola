import React from 'react';
import { Link } from 'react-router-dom';
import { get } from 'lodash';
import { FaUserCircle, FaEdit, FaWindowClose } from 'react-icons/fa';

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

  return (
    <Container>
      <Loading isLoading={isLoading} />

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

            <span>
              {student.name} {student.last_name}
            </span>
            <span>{student.email}</span>

            <Link to={`/student/${student.id}`}>
              <FaEdit size={16} />{' '}
            </Link>
            <Link to={`/student/${student.id}`}>
              <FaWindowClose size={16} />{' '}
            </Link>
          </div>
        ))}
      </StudentContainer>
    </Container>
  );
}
