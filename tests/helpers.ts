import { Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { TIngredient } from '../src/utils/types';

const harsDir = path.join(__dirname, 'hars');

type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

type TOrderResponse = {
  success: boolean;
  order: {
    number: number;
  };
};

const readHarBody = <T>(harFile: string, urlPart: string): T => {
  const har = JSON.parse(fs.readFileSync(path.join(harsDir, harFile), 'utf-8'));
  const entry = har.log.entries.find(
    (item: { request: { url: string }; response: { status: number } }) =>
      item.request.url.includes(urlPart) && item.response.status === 200
  );

  return JSON.parse(entry.response.content.text);
};

const ingredientsMock = readHarBody<TIngredientsResponse>(
  'constructor.har',
  '/ingredients'
);

const orderMock = readHarBody<TOrderResponse>('order.har', '/orders');

export const bun = ingredientsMock.data.find((item) => item.type === 'bun')!;
export const main = ingredientsMock.data.find((item) => item.type === 'main')!;
export const orderNumber = orderMock.order.number;

export const mockBackendFromHar = async (page: Page, harFile: string) => {
  await page.routeFromHAR(path.join(harsDir, harFile), {
    url: '**/api/**',
    notFound: 'abort',
    update: false
  });
};

export const setAuthTokens = async (page: Page) => {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer%20test-access-token',
      url: 'http://localhost:4000'
    }
  ]);

  await page.addInitScript(() => {
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
  });
};
