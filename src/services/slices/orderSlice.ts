import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

// Тип для ответа от API при создании заказа
export type TOrderResponse = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  price: number;
  owner?: {
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
};

// Асинхронный thunk для создания заказа
export const createOrder = createAsyncThunk<TOrderResponse, string[]>(
  'order/create',
  async (data) => {
    const response = await orderBurgerApi(data);

    return response.order;
  }
);

// Асинхронный thunk для получения заказа по номеру (для просмотра)
export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'order/fetchByNumber',
  async (number) => {
    const response = await getOrderByNumberApi(number);

    return response.orders[0];
  }
);

type TOrderState = {
  // Последний успешно созданный заказ.
  order: TOrder | null;

  // Заказ, который пользователь сейчас просматривает.
  orderView: TOrder | null;

  // Номер заказа, который пользователь запрашивал для просмотра.
  orderViewNumber: number | null;

  loading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: TOrderState = {
  order: null,
  orderView: null,
  orderViewNumber: null,
  loading: false,
  error: null
};

// Слайс
const orderSlice = createSlice({
  name: 'order',
  initialState,

  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.error = null;
      state.loading = false;
    },

    clearOrderView: (state) => {
      state.orderView = null;
      state.orderViewNumber = null;
    }
  },

  extraReducers: (builder) => {
    builder
      // Создание заказа
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrderResponse>) => {
          state.loading = false;

          // Трансформируем TOrderResponse в TOrder
          state.order = {
            _id: action.payload._id,
            status: action.payload.status,
            name: action.payload.name,
            createdAt: action.payload.createdAt,
            updatedAt: action.payload.updatedAt,
            number: action.payload.number,
            ingredients: []
          };
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      })

      // Получение заказа для просмотра
      .addCase(fetchOrderByNumber.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.orderViewNumber = action.meta.arg;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderView = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка получения заказа';
      });
  }
});

// Экспорт действий
export const { clearOrder, clearOrderView } = orderSlice.actions;

// Экспорт редьюсера
export default orderSlice.reducer;
