import { Middleware } from '@reduxjs/toolkit';
import {
  wsConnect,
  wsDisconnect,
  wsMessage,
  wsError
} from '../slices/feedSlice';

export const socketMiddleware = (): Middleware => {
  let socket: WebSocket | null = null;

  return ({ dispatch }) =>
    (next) =>
    (action) => {
      if (wsConnect.match(action)) {
        socket = new WebSocket('wss://norma.education-services.ru/feed');

        socket.onopen = () => {
          // WebSocket подключён
        };

        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          dispatch(wsMessage(data));
        };

        socket.onerror = (error) => {
          console.error('❌ WebSocket ошибка:', error);
          dispatch(wsError('Ошибка WebSocket'));
        };

        socket.onclose = () => {
          // WebSocket отключён
          dispatch(wsDisconnect());
        };
      }

      if (wsDisconnect.match(action) && socket) {
        socket.close();
        socket = null;
      }

      return next(action);
    };
};
