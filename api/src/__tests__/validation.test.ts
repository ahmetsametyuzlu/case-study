import { validateStudentInput, formatStudentDate } from '../utils/validation';

describe('validateStudentInput', () => {
  it('should return valid for correct input', () => {
    const result = validateStudentInput({
      Name: 'John Doe',
      Email: 'john@example.com',
    });
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should return error when Name is missing', () => {
    const result = validateStudentInput({
      Name: '',
      Email: 'john@example.com',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Name is required');
  });

  it('should return error when Email is missing', () => {
    const result = validateStudentInput({
      Name: 'John Doe',
      Email: '',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Email is required');
  });

  it('should return error for invalid email format', () => {
    const result = validateStudentInput({
      Name: 'John Doe',
      Email: 'not-an-email',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid email format');
  });

  it('should return error when Name is only whitespace', () => {
    const result = validateStudentInput({
      Name: '   ',
      Email: 'john@example.com',
    });
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Name is required');
  });
});

describe('formatStudentDate', () => {
  it('should format a date string to ISO format', () => {
    const result = formatStudentDate('2026-01-15T10:30:00Z');
    expect(result).toBe('2026-01-15T10:30:00.000Z');
  });
});
