import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getUser } from '../../services/slices/userSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import {
  AppHeader,
  Modal,
  IngredientDetails,
  OrderInfo,
  ProtectedRoute
} from '@components';

import '../../index.css';
import styles from './app.module.css';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const background = location.state?.background;

  // Загружаем ингредиенты один раз при запуске приложения.
  // Благодаря этому данные доступны всем страницам приложения.
  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  // Проверяем авторизацию один раз при запуске.
  // Пока проверка не завершена, ProtectedRoute показывает Preloader.
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные маршруты.
          Если открыта модалка, в качестве location используется background,
          поэтому под модалкой остаётся предыдущая страница. */}
      <Routes location={background || location}>
        {/* Публичные маршруты */}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />

        {/* Прямой переход на заказ из ленты */}
        <Route path='/feed/:number' element={<OrderInfo />} />

        {/* Страницы авторизации доступны только неавторизованным */}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        {/* Защищённые маршруты (только для авторизованных) */}
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        {/* Прямой переход на заказ из истории */}
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        {/* Прямой переход на ингредиент */}
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        {/* Страница 404 */}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные маршруты.
          Они используются только при наличии background. */}
      {background && (
        <Routes>
          {/* Детали заказа из ленты */}
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />

          {/* Детали ингредиента */}
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />

          {/* Детали заказа из истории */}
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Детали заказа' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
