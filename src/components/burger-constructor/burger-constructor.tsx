import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { getConstructorItems } from '../../services/selectors/constructorSelectors';
import {
  getOrder,
  getOrderLoading
} from '../../services/selectors/orderSelectors';
import { getIsLoggedIn } from '../../services/selectors/userSelectors';
import { createOrder, clearOrder } from '../../services/slices/orderSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { fetchUserOrders } from '../../services/slices/userSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем данные из стора
  const constructorItems = useSelector(getConstructorItems);
  const orderRequest = useSelector(getOrderLoading);
  const orderModalData = useSelector(getOrder);
  const isLoggedIn = useSelector(getIsLoggedIn);

  // Обработчик клика по кнопке "Оформить заказ"
  const onOrderClick = () => {
    // Проверка: есть ли булка
    if (!constructorItems.bun) {
      return;
    }

    // Проверка: не идёт ли уже заказ
    if (orderRequest) {
      return;
    }

    // Проверка авторизации
    if (!isLoggedIn) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    // Собираем ID ингредиентов для отправки на сервер
    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id // булка добавляется дважды
    ];

    // Отправляем запрос на создание заказа
    dispatch(createOrder(ingredientsIds))
      .unwrap()
      .then(() => {
        // Обновляем ленту заказов
        dispatch(fetchFeeds());
        // Обновляем историю заказов пользователя
        dispatch(fetchUserOrders());
      })
      .catch((error) => {
        // Обработка ошибки
        console.error('Ошибка создания заказа:', error);
      });
  };

  // Закрытие модалки с номером заказа
  const closeOrderModal = () => {
    dispatch(clearOrder());
    dispatch(clearConstructor());
  };

  // Подсчёт общей стоимости
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
