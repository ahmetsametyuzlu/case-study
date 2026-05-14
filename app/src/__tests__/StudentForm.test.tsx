import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StudentForm from '../components/StudentForm';

describe('StudentForm', () => {
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  it('renders empty form for new student', () => {
    render(<StudentForm student={null} onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByText('Add New Student')).toBeInTheDocument();
    expect(screen.getByLabelText('Name *')).toHaveValue('');
    expect(screen.getByLabelText('Email *')).toHaveValue('');
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('renders pre-filled form for editing', () => {
    const student = {
      StudentId: 1,
      Name: 'John Doe',
      Email: 'john@example.com',
      Phone: '555-1234',
      Department: 'CS',
    };

    render(<StudentForm student={student} onSave={mockOnSave} onCancel={mockOnCancel} />);

    expect(screen.getByText('Edit Student')).toBeInTheDocument();
    expect(screen.getByLabelText('Name *')).toHaveValue('John Doe');
    expect(screen.getByLabelText('Email *')).toHaveValue('john@example.com');
    expect(screen.getByText('Update')).toBeInTheDocument();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    render(<StudentForm student={null} onSave={mockOnSave} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalledOnce();
  });
});
