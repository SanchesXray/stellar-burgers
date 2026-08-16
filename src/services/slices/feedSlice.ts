import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder, TOrdersData } from '@utils-types';

// Асинхронный thunk для получения ленты заказов
export const fetchFeeds = createAsyncThunk<TOrdersData, void>(
  'feed/fetch',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

// Тип состояния ленты
type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

// Слайс
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    // 👇 WebSocket-экшены
    wsConnect: (state) => {
      state.loading = true;
      state.error = null;
    },
    wsDisconnect: (state) => {
      state.loading = false;
    },
    wsMessage: (state, action) => {
      state.loading = false;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    wsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты заказов';
      });
  }
});

// Экспорт действий
export const { wsConnect, wsDisconnect, wsMessage, wsError } =
  feedSlice.actions;

// Экспорт редьюсера
export default feedSlice.reducer;
