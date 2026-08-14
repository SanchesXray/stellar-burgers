import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  logoutApi,
  getUserApi,
  updateUserApi,
  getOrdersApi
} from '@api';
import { TUser, TOrder } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

// Авторизация пользователя
export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await loginUserApi({ email, password });

    // Сохраняем токены в cookies
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

// Регистрация пользователя
export const registerUser = createAsyncThunk(
  'user/register',
  async ({
    email,
    name,
    password
  }: {
    email: string;
    name: string;
    password: string;
  }) => {
    const response = await registerUserApi({
      email,
      name,
      password
    });

    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

// Выход пользователя
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();

  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

// Проверка текущего пользователя
export const getUser = createAsyncThunk('user/get', async () => {
  const response = await getUserApi();

  if (!response || !response.success) {
    throw new Error('Пользователь не авторизован');
  }

  return response.user;
});

// Обновление данных пользователя
export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: Partial<TUser>) => {
    const response = await updateUserApi(userData);

    return response.user;
  }
);

// Получение истории заказов пользователя
export const fetchUserOrders = createAsyncThunk(
  'user/fetchOrders',
  async () => {
    const response = await getOrdersApi();

    return response;
  }
);

// Тип состояния пользователя
type TUserState = {
  user: TUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isAuthChecked: boolean;
  error: string | null;
  orders: TOrder[];
};

// Начальное состояние
const initialState: TUserState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  isAuthChecked: false,
  error: null,
  orders: []
};

// Слайс
const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    // Синхронный выход (очистка состояния)
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      state.orders = [];
    }
  },

  extraReducers: (builder) => {
    builder
      // Авторизация
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка входа';
      })

      // Регистрация
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })

      // Выход
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isLoggedIn = false;
        state.orders = [];
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
      })

      // Проверка авторизации пользователя
      .addCase(getUser.pending, (state) => {
        state.isAuthChecked = false;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(getUser.rejected, (state) => {
        // Неавторизованный пользователь — штатная ситуация, не ошибка формы.
        state.isAuthChecked = true;
        state.user = null;
        state.isLoggedIn = false;
        state.error = null;
      })

      // Обновление данных пользователя
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка обновления данных';
      })

      // История заказов
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка получения заказов';
      });
  }
});

// Экспорт действий
export const { logout } = userSlice.actions;

// Экспорт редьюсера
export default userSlice.reducer;
