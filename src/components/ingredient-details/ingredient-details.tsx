import { FC } from 'react';
import { useParams } from 'react-router-dom';
// Подключаем селектор для получения ингредиентов из стора
import { useSelector } from '../../services/store';
import { getIngredients } from '../../services/selectors/ingredientsSelectors';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  // Получаем id ингредиента из URL
  const { id } = useParams<{ id: string }>();
  // Получаем все ингредиенты из стора
  const ingredients = useSelector(getIngredients);
  // Находим нужный ингредиент по id
  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
