import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Базовый селектор с защитой
export const getConstructorState = (state: RootState) =>
  state.constructorBurger;

// Мемоизированные селекторы
export const getConstructorBun = createSelector(
  getConstructorState,
  (state) => state.bun || null
);

export const getConstructorIngredients = createSelector(
  getConstructorState,
  (state) => state.ingredients || []
);

export const getConstructorItems = createSelector(
  getConstructorBun,
  getConstructorIngredients,
  (bun, ingredients) => ({
    bun,
    ingredients: ingredients || []
  })
);

export const getTotalPrice = createSelector(
  getConstructorBun,
  getConstructorIngredients,
  (bun, ingredients) => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = (ingredients || []).reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }
);
