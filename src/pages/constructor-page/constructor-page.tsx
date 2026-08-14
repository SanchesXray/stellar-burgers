import { FC } from 'react';
import { useSelector } from '../../services/store';
import { getIngredientsLoading } from '../../services/selectors/ingredientsSelectors';
import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import styles from './constructor-page.module.css';

export const ConstructorPage: FC = () => {
  const loading = useSelector(getIngredientsLoading);

  if (loading) {
    return <Preloader />;
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
      >
        Соберите бургер
      </h1>
      <div className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
