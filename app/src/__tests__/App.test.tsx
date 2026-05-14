import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock the studentService
vi.mock('../services/studentService', () => ({
  studentService: {
    getAll: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the header', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Student Management')).toBeInTheDocument();
      expect(screen.getByText('Simple CRUD Application')).toBeInTheDocument();
    });
  });

  it('renders the Add Student button', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Add Student')).toBeInTheDocument();
    });
  });

  it('shows empty state after loading', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/No students found/)).toBeInTheDocument();
    });
  });
});
