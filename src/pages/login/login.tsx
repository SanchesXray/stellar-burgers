import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import {
  getIsLoggedIn,
  getUserError
} from '../../services/selectors/userSelectors';
import { LoginUI } from '@ui-pages';
import { Navigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn);
  const error = useSelector(getUserError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Если уже авторизован — редирект на главную
  if (isLoggedIn) {
    return <Navigate to='/' replace />;
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
