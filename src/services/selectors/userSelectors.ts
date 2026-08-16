import { RootState } from '../store';

export const getUser = (state: RootState) => state.user.user;
export const getUserName = (state: RootState) => state.user.user?.name || '';
export const getUserEmail = (state: RootState) => state.user.user?.email || '';
export const getIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const getIsAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const getUserLoading = (state: RootState) => state.user.isLoading;
export const getUserError = (state: RootState) => state.user.error;
export const getUserOrders = (state: RootState) => state.user.orders;
