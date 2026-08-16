import { test, expect, Page } from '@playwright/test';
import {
  bun,
  main,
  mockBackendFromHar,
  orderNumber,
  setAuthTokens
} from './helpers';

const ingredientCard = (page: Page, name: string) =>
  page.locator('li').filter({ hasText: name });

const constructorSection = (page: Page) =>
  page.locator('section').filter({
    has: page.getByRole('button', { name: 'Оформить заказ' })
  });

const modalRoot = (page: Page) => page.locator('#modals');

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendFromHar(page, 'constructor.har');
    await page.goto('/');
    await expect(page.getByText(bun.name)).toBeVisible();
  });

  test('добавление булки и начинки из списка в конструктор', async ({
    page
  }) => {
    await ingredientCard(page, bun.name)
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(constructorSection(page)).toContainText(`${bun.name} (верх)`);
    await expect(constructorSection(page)).toContainText(`${bun.name} (низ)`);

    await ingredientCard(page, main.name)
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(constructorSection(page)).toContainText(main.name);
  });

  test.describe('Модальное окно ингредиента', () => {
    test('открывается по клику и показывает данные выбранного ингредиента', async ({
      page
    }) => {
      await ingredientCard(page, bun.name).locator('a').click();

      await expect(modalRoot(page)).toContainText('Детали ингредиента');
      await expect(
        modalRoot(page).getByRole('heading', { name: bun.name })
      ).toBeVisible();
      await expect(modalRoot(page)).toContainText('Калории, ккал');
      await expect(modalRoot(page)).toContainText(String(bun.calories));
    });

    test('закрывается по клику на крестик', async ({ page }) => {
      await ingredientCard(page, bun.name).locator('a').click();
      await expect(modalRoot(page)).toContainText('Детали ингредиента');

      await modalRoot(page).getByRole('button').click();

      await expect(modalRoot(page)).toBeEmpty();
    });

    test('закрывается по клику на оверлей', async ({ page }) => {
      await ingredientCard(page, bun.name).locator('a').click();
      await expect(modalRoot(page)).toContainText('Детали ингредиента');

      await modalRoot(page)
        .locator(':scope > div')
        .last()
        .click({ position: { x: 5, y: 5 } });

      await expect(modalRoot(page)).toBeEmpty();
    });
  });
});

test.describe('Создание заказа', () => {
  test('оформляет заказ, показывает верный номер и очищает конструктор', async ({
    page
  }) => {
    await mockBackendFromHar(page, 'order.har');
    await setAuthTokens(page);
    await page.goto('/');
    await expect(page.getByText(bun.name)).toBeVisible();

    await ingredientCard(page, bun.name)
      .getByRole('button', { name: 'Добавить' })
      .click();
    await ingredientCard(page, main.name)
      .getByRole('button', { name: 'Добавить' })
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(modalRoot(page)).toContainText(String(orderNumber));
    await expect(modalRoot(page)).toContainText('идентификатор заказа');

    await expect(constructorSection(page)).toContainText('Выберите булки');
    await expect(constructorSection(page)).toContainText('Выберите начинку');
    await expect(constructorSection(page)).not.toContainText(
      `${bun.name} (верх)`
    );

    await modalRoot(page).getByRole('button').click();
    await expect(modalRoot(page)).toBeEmpty();
  });
});
