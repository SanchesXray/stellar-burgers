import { FC } from 'react';
// Подключаем селекторы для получения данных о ленте заказов из стора
import { useSelector } from '../../services/store';
import {
  getFeedOrders,
  getFeedTotal,
  getFeedTotalToday
} from '../../services/selectors/feedSelectors';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получаем данные из стора
  const orders = useSelector(getFeedOrders);
  const feed = {
    total: useSelector(getFeedTotal),
    totalToday: useSelector(getFeedTotalToday)
  };

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
