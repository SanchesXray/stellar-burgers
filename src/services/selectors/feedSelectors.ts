import { RootState } from '../store';

export const getFeedOrders = (state: RootState) => state.feed.orders;
export const getFeedTotal = (state: RootState) => state.feed.total;
export const getFeedTotalToday = (state: RootState) => state.feed.totalToday;
export const getFeedLoading = (state: RootState) => state.feed.loading;
export const getFeedError = (state: RootState) => state.feed.error;
