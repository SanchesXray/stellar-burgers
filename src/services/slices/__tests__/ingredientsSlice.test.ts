import { TIngredient } from '@utils-types';
import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const mockMain: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png'
};

const initialState = {
  items: [],
  loading: false,
  error: null
};

describe('ingredientsSlice reducer', () => {
  test('возвращает начальное состояние для неизвестного экшена и state = undefined', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  test('обрабатывает fetchIngredients.pending', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type
    });

    expect(state).toEqual({
      items: [],
      loading: true,
      error: null
    });
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const ingredients = [mockBun, mockMain];
    const state = ingredientsReducer(
      { items: [], loading: true, error: 'старая ошибка' },
      {
        type: fetchIngredients.fulfilled.type,
        payload: ingredients
      }
    );

    expect(state).toEqual({
      items: ingredients,
      loading: false,
      error: 'старая ошибка'
    });
  });

  test('обрабатывает fetchIngredients.rejected с сообщением ошибки', () => {
    const state = ingredientsReducer(
      { items: [mockBun], loading: true, error: null },
      {
        type: fetchIngredients.rejected.type,
        error: { message: 'Ошибка сети' }
      }
    );

    expect(state).toEqual({
      items: [mockBun],
      loading: false,
      error: 'Ошибка сети'
    });
  });

  test('обрабатывает fetchIngredients.rejected без сообщения ошибки', () => {
    const state = ingredientsReducer(initialState, {
      type: fetchIngredients.rejected.type,
      error: {}
    });

    expect(state.error).toBe('Ошибка загрузки ингредиентов');
    expect(state.loading).toBe(false);
  });
});
