import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

// Тип для ингредиента в конструкторе (с уникальным id)
export type TConstructorItem = TIngredient & { id: string };

// Тип состояния конструктора
type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorItem[];
};

// Начальное состояние
const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

// Слайс
const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    // Добавление ингредиента
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;

      if (ingredient.type === 'bun') {
        state.bun = ingredient;
      } else {
        state.ingredients = [
          ...state.ingredients,
          {
            ...ingredient,
            id: uuidv4()
          }
        ];
      }
    },
    // Удаление ингредиента
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    // Удаление булки
    removeBun: (state) => {
      state.bun = null;
    },
    // Перемещение ингредиента (для drag-and-drop)
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      if (state.ingredients.length > 0) {
        const [removed] = state.ingredients.splice(from, 1);
        state.ingredients.splice(to, 0, removed);
      }
    },
    // Очистка конструктора
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

// Экспорт действий
export const {
  addIngredient,
  removeIngredient,
  removeBun,
  moveIngredient,
  clearConstructor
} = constructorSlice.actions;

// Экспорт редьюсера
export default constructorSlice.reducer;
