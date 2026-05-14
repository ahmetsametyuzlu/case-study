import { test, expect } from '@playwright/test';
import { createStudent, deleteAllStudents, waitForApi } from './helpers/api-client';

test.describe('Student Management App', () => {
  test.beforeAll(async () => {
    await waitForApi();
  });

  test.beforeEach(async () => {
    await deleteAllStudents();

    await createStudent({
      Name: 'Ahmet Yılmaz',
      Email: 'ahmet@example.com',
      Phone: '555-0001',
      Department: 'Computer Science',
    });
    await createStudent({
      Name: 'Elif Kaya',
      Email: 'elif@example.com',
      Phone: '555-0002',
      Department: 'Mathematics',
    });
  });

  test.afterAll(async () => {
    await deleteAllStudents();
  });

  test('displays the main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Student Management')).toBeVisible();
    await expect(page.getByText('Simple CRUD Application')).toBeVisible();
  });

  test('shows Add Student button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Add Student')).toBeVisible();
  });

  test('lists students from database', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Ahmet Yılmaz')).toBeVisible();
    await expect(page.getByText('elif@example.com')).toBeVisible();
    await expect(page.getByText('Total: 2 students')).toBeVisible();
  });

  test('opens the form when Add Student is clicked', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Add Student').click();
    await expect(page.getByText('Add New Student')).toBeVisible();
    await expect(page.getByLabel('Name *')).toBeVisible();
    await expect(page.getByLabel('Email *')).toBeVisible();
    await expect(page.getByLabel('Phone')).toBeVisible();
    await expect(page.getByLabel('Department')).toBeVisible();
  });

  test('creates a new student and persists it', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Add Student').click();

    await page.getByLabel('Name *').fill('Test Student');
    await page.getByLabel('Email *').fill('test@example.com');
    await page.getByLabel('Phone').fill('555-9999');
    await page.getByLabel('Department').fill('Physics');
    await page.getByRole('button', { name: 'Create' }).click();

    await expect(page.getByText('Test Student')).toBeVisible();
    await expect(page.getByText('Total: 3 students')).toBeVisible();

    await page.reload();
    await expect(page.getByText('Test Student')).toBeVisible();
    await expect(page.getByText('test@example.com')).toBeVisible();
  });

  test('closes the form on Cancel', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Add Student').click();
    await expect(page.getByText('Add New Student')).toBeVisible();

    await page.getByText('Cancel').click();
    await expect(page.getByText('Add Student')).toBeVisible();
  });

  test('requires Name and Email fields', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Add Student').click();

    await expect(page.getByLabel('Name *')).toHaveAttribute('required', '');
    await expect(page.getByLabel('Email *')).toHaveAttribute('required', '');
  });

  test('populates the edit form with existing data', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Edit' }).first().click();

    await expect(page.getByText('Edit Student')).toBeVisible();
    await expect(page.getByLabel('Name *')).not.toHaveValue('');
    await expect(page.getByLabel('Email *')).not.toHaveValue('');
    await expect(page.getByRole('button', { name: 'Update' })).toBeVisible();
  });

  test('updates a student and persists changes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Edit' }).first().click();
    await expect(page.getByText('Edit Student')).toBeVisible();

    await page.getByLabel('Name *').clear();
    await page.getByLabel('Name *').fill('Updated Name');
    await page.getByLabel('Email *').clear();
    await page.getByLabel('Email *').fill('updated@example.com');
    await page.getByRole('button', { name: 'Update' }).click();

    await expect(page.getByText('Updated Name')).toBeVisible();
    await expect(page.getByText('updated@example.com')).toBeVisible();

    await page.reload();
    await expect(page.getByText('Updated Name')).toBeVisible();
    await expect(page.getByText('updated@example.com')).toBeVisible();
  });

  test('deletes a student', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Total: 2 students')).toBeVisible();

    page.on('dialog', (dialog) => dialog.accept());
    await page.getByRole('button', { name: 'Delete' }).first().click();

    await expect(page.getByText('Total: 1 student')).toBeVisible({ timeout: 5000 }).catch(async () => {
      await expect(page.getByText('Total: 1 students')).toBeVisible();
    });

    await page.reload();
    await expect(page.getByText('Total: 2 students')).not.toBeVisible();
  });

  test('shows empty state with no students', async ({ page }) => {
    await deleteAllStudents();

    await page.goto('/');
    await expect(page.getByText('Total: 0 students')).toBeVisible({ timeout: 5000 }).catch(async () => {
      await expect(page.getByText('No students')).toBeVisible();
    });
  });
});
