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
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

// Тип состояния заказа
type TOrderState = {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: TOrderState = {
  order: null,
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
    }
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка получения заказа';
      });
  }
});

// Экспорт действий
export const { clearOrder } = orderSlice.actions;

// Экспорт редьюсера
export default orderSlice.reducer;
