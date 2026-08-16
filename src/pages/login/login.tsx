import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import { getUserError } from '../../services/selectors/userSelectors';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const error = useSelector(getUserError);
  const [localError, setLocalError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setLocalError('');

    dispatch(loginUser({ email, password }))
      .unwrap()
      .catch((err) => {
        setLocalError(err.message || 'Ошибка входа');
      });
  };

  const errorText = localError || error || '';

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
