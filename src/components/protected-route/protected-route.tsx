// src/components/protected-route/protected-route.tsx
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIsLoggedIn } from '../../services/selectors/userSelectors';
import { getCookie } from '../../utils/cookie';

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const isLoggedIn = useSelector(getIsLoggedIn);

  // проверка есть ли токен в cookies?
  const accessToken = getCookie('accessToken');
  const hasToken = !!accessToken;

  // Если нет токена и не залогинены — редирект на логин
  if (!hasToken && !isLoggedIn) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Если есть токен — показываем страницу (даже если isLoggedIn = false)
  return children;
};

export default ProtectedRoute;
