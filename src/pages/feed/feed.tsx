import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';

import {
  getFeedOrders,
  getFeedLoading
} from '../../services/selectors/feedSelectors';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  // Берём данные из стора с типизацией
  const orders: TOrder[] = useSelector(getFeedOrders);
  const loading = useSelector(getFeedLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (loading || (!loading && orders.length === 0)) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
