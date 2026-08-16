import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

// Асинхронный thunk для загрузки ингредиентов
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  getIngredientsApi
);

// Тип состояния
type TIngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: TIngredientsState = {
  items: [],
  loading: false,
  error: null
};

// Слайс
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      });
  }
});

export default ingredientsSlice.reducer;
