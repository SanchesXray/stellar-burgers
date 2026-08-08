import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/userSlice';
import { getUserOrders } from '../../services/selectors/userSelectors';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  // Используем селектор для получения заказов
  const orders: TOrder[] = useSelector(getUserOrders);

  // Загружаем историю заказов
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
