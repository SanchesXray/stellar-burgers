import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';
import { getUser as getUserSelector } from '../../services/selectors/userSelectors';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUserSelector);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  // Обновляем форму при изменении данных пользователя.
  // password: '' нужен, чтобы после сохранения кнопки исчезли.
  useEffect(() => {
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Отправляем только изменённые поля
    const updateData: { name?: string; email?: string; password?: string } = {};
    if (formValue.name !== user?.name) updateData.name = formValue.name;
    if (formValue.email !== user?.email) updateData.email = formValue.email;
    if (formValue.password) updateData.password = formValue.password;

    // После сохранения сбрасываем пароль, чтобы кнопки исчезли
    dispatch(updateUser(updateData))
      .unwrap()
      .then(() => {
        setFormValue((prev) => ({ ...prev, password: '' }));
      });
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
