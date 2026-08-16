import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchOrderByNumber,
  clearOrderView
} from '../../services/slices/orderSlice';
import {
  getOrderView,
  getOrderLoading
} from '../../services/selectors/orderSelectors';
import { getIngredients } from '../../services/selectors/ingredientsSelectors';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  // Получаем данные заказа и ингредиенты из стора
  const orderData = useSelector(getOrderView);
  const ingredients = useSelector(getIngredients);
  const loading = useSelector(getOrderLoading);

  // Загружаем заказ при монтировании
  useEffect(() => {
    if (number) {
      dispatch(fetchOrderByNumber(Number(number)));
    }
    // Очищаем просмотр при размонтировании
    return () => {
      dispatch(clearOrderView());
    };
  }, [dispatch, number]);
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, ingredientId) => {
        if (!acc[ingredientId]) {
          const ingredient = ingredients.find(
            (item) => item._id === ingredientId
          );

          if (ingredient) {
            acc[ingredientId] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[ingredientId].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, ingredient) => sum + ingredient.price * ingredient.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
