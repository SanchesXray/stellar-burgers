import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

// Импорт редьюсера
import { rootReducer } from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем проверку для constructor (из-за nanoid в addIngredient)

        ignoredPaths: ['constructor', 'feed'],
        ignoredActions: [
          'ingredients/fetch/pending',
          'ingredients/fetch/fulfilled',
          'ingredients/fetch/rejected',
          'feed/fetch/pending',
          'feed/fetch/fulfilled',
          'feed/fetch/rejected'
        ]
      }
    })
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
