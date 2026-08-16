// src/components/protected-route/protected-route.tsx

import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  getIsAuthChecked,
  getUser
} from '../../services/selectors/userSelectors';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();

  const user = useSelector(getUser);
  const isAuthChecked = useSelector(getIsAuthChecked);

  // Пока сервер не ответил на проверку авторизации,
  // не делаем никаких редиректов.
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // Приватный маршрут для авторизованного пользователя.
  // Если пользователь не авторизован — отправляем на login
  // и сохраняем исходный маршрут.
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Маршрут только для неавторизованного пользователя.
  // Если пользователь уже авторизован, возвращаем его
  // на маршрут, который он хотел открыть до авторизации.
  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate to={from} replace />;
  }

  return children;
};

export default ProtectedRoute;
