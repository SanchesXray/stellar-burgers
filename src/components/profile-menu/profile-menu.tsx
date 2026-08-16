import { FC } from 'react';
import { useLocation } from 'react-router-dom';
// Подключаем dispatch для отправки экшена выхода
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/userSlice';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  // При клике на "Выйти" отправляем запрос на сервер и очищаем данные пользователя
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
