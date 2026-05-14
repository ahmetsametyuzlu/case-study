import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StudentList from '../components/StudentList';

describe('StudentList', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  it('shows empty state when no students', () => {
    render(<StudentList students={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    expect(screen.getByText(/No students found/)).toBeInTheDocument();
  });

  it('renders student rows', () => {
    const students = [
      {
        StudentId: 1,
        Name: 'Jane Doe',
        Email: 'jane@example.com',
        Phone: '555-0001',
        Department: 'Engineering',
        CreatedDate: '2026-01-15T10:00:00Z',
      },
      {
        StudentId: 2,
        Name: 'Bob Smith',
        Email: 'bob@example.com',
        Phone: '',
        Department: '',
        CreatedDate: '2026-02-20T12:00:00Z',
      },
    ];

    render(<StudentList students={students} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    expect(screen.getAllByText('Edit')).toHaveLength(2);
    expect(screen.getAllByText('Delete')).toHaveLength(2);
  });

  it('renders table headers', () => {
    const students = [
      {
        StudentId: 1,
        Name: 'Test',
        Email: 'test@test.com',
        Phone: '',
        Department: '',
      },
    ];

    render(<StudentList students={students} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
  });
});
