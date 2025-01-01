import { expect, test } from '@playwright/test';

test('overview expects Immich Server', async ({ page }) => {
	await page.goto('overview');
	expect(await page.getByText('Immich Version'))
});

test('overview expects Total Disk Size', async ({ page }) => {
	await page.goto('overview');
	expect(await page.getByText('Total Disk Size'))
});

test('overview expects Free Disk Space', async ({ page }) => {
	await page.goto('overview');
	expect(await page.getByText('Free Disk Space'))
});

test('overview expects Disk Usage', async ({ page }) => {
	await page.goto('overview');
	expect(await page.getByText('Disk Usage'))
});

test('overview expects Users', async ({ page }) => {
	await page.goto('overview');
	expect(await page.getByText('Users'))
});

test('overview expects Total Media Size', async ({ page }) => {
	await page.goto('overview');
	expect(await page.getByText('Total Media Size'))
});

test('overview expects Photos', async ({ page }) => {
	await page.goto('overview');
	expect(await page.getByText('Photos'))
});

test('overview expects Videos', async ({ page }) => {
	await page.goto('overview');
	expect(await page.getByText('Videos'))
});





