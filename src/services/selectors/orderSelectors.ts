import { RootState } from '../store';

export const getOrder = (state: RootState) => state.order.order;
export const getOrderLoading = (state: RootState) => state.order.loading;
export const getOrderError = (state: RootState) => state.order.error;
