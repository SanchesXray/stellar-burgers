import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getUserName } from '../../services/selectors/userSelectors';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
// Импортируем стили ИЗ UI
import styles from '@ui/app-header/app-header.module.css';

export const AppHeader: FC = () => {
  const userName = useSelector(getUserName);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default ml-2 mr-10'>
                  Конструктор
                </p>
              </>
            )}
          </NavLink>

          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default ml-2'>
                  Лента заказов
                </p>
              </>
            )}
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to='/'>
            <Logo className={styles.logo} />
          </NavLink>
        </div>

        <div className={styles.link_position_last}>
          <NavLink
            to={userName ? '/profile' : '/login'}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default ml-2'>
                  {userName || 'Личный кабинет'}
                </p>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
