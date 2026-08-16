import { TIngredient } from '@utils-types';
import constructorReducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeBun,
  removeIngredient
} from '../constructorSlice';

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

const mockSauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png'
};

const initialState = {
  bun: null,
  ingredients: []
};

describe('constructorSlice reducer', () => {
  test('возвращает начальное состояние для неизвестного экшена и state = undefined', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual(initialState);
  });

  test('addIngredient добавляет булку без поля id', () => {
    const state = constructorReducer(initialState, addIngredient(mockBun));

    expect(state.bun).toEqual(mockBun);
    expect(state.bun).not.toHaveProperty('id');
    expect(state.ingredients).toEqual([]);
  });

  test('addIngredient заменяет булку', () => {
    const anotherBun: TIngredient = {
      ...mockBun,
      _id: 'bun-2',
      name: 'Флюоресцентная булка'
    };
    const withBun = constructorReducer(initialState, addIngredient(mockBun));
    const state = constructorReducer(withBun, addIngredient(anotherBun));

    expect(state.bun).toEqual(anotherBun);
  });

  test('addIngredient добавляет начинку с уникальным id', () => {
    const state = constructorReducer(initialState, addIngredient(mockMain));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(
      expect.objectContaining({
        ...mockMain,
        id: expect.any(String)
      })
    );
  });

  test('removeIngredient удаляет начинку по id', () => {
    const withFilling = constructorReducer(initialState, addIngredient(mockMain));
    const fillingId = withFilling.ingredients[0].id;
    const state = constructorReducer(
      withFilling,
      removeIngredient(fillingId)
    );

    expect(state.ingredients).toEqual([]);
  });

  test('removeBun удаляет булку', () => {
    const withBun = constructorReducer(initialState, addIngredient(mockBun));
    const state = constructorReducer(withBun, removeBun());

    expect(state.bun).toBeNull();
  });

  test('moveIngredient меняет порядок начинок', () => {
    const withMain = constructorReducer(initialState, addIngredient(mockMain));
    const withBoth = constructorReducer(withMain, addIngredient(mockSauce));
    const [firstId, secondId] = withBoth.ingredients.map((item) => item.id);

    const state = constructorReducer(
      withBoth,
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state.ingredients.map((item) => item.id)).toEqual([
      secondId,
      firstId
    ]);
  });

  test('clearConstructor очищает булку и начинки', () => {
    const withBun = constructorReducer(initialState, addIngredient(mockBun));
    const withItems = constructorReducer(withBun, addIngredient(mockMain));
    const state = constructorReducer(withItems, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
