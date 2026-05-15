import { studentRepository } from '../repositories/student.repository';
import { getPool } from '../config/database';

jest.mock('../config/database');

const mockedGetPool = getPool as jest.MockedFunction<typeof getPool>;

const mockQuery = jest.fn();
const mockInput = jest.fn().mockReturnThis();
const mockRequest = jest.fn().mockReturnValue({
  query: mockQuery,
  input: mockInput,
});

beforeEach(() => {
  jest.clearAllMocks();
  mockedGetPool.mockResolvedValue({ request: mockRequest } as unknown as Awaited<
    ReturnType<typeof getPool>
  >);
  mockInput.mockReturnValue({ query: mockQuery, input: mockInput });
});

const sampleRecord = {
  StudentId: 1,
  Name: 'Test',
  Email: 'test@test.com',
  Phone: '555-0001',
  Department: 'CS',
  CreatedDate: new Date(),
};

describe('studentRepository.findAll', () => {
  it('returns all students', async () => {
    mockQuery.mockResolvedValue({ recordset: [sampleRecord] });

    const result = await studentRepository.findAll();

    expect(result).toEqual([sampleRecord]);
    expect(mockRequest).toHaveBeenCalled();
  });

  it('returns empty array when no students', async () => {
    mockQuery.mockResolvedValue({ recordset: [] });

    const result = await studentRepository.findAll();

    expect(result).toEqual([]);
  });
});

describe('studentRepository.findById', () => {
  it('returns student when found', async () => {
    mockQuery.mockResolvedValue({ recordset: [sampleRecord] });

    const result = await studentRepository.findById('1');

    expect(result).toEqual(sampleRecord);
    expect(mockInput).toHaveBeenCalledWith('id', '1');
  });

  it('returns null when not found', async () => {
    mockQuery.mockResolvedValue({ recordset: [] });

    const result = await studentRepository.findById('999');

    expect(result).toBeNull();
  });
});

describe('studentRepository.create', () => {
  it('creates and returns the student', async () => {
    mockQuery.mockResolvedValue({ recordset: [sampleRecord] });

    const result = await studentRepository.create({
      Name: 'Test',
      Email: 'test@test.com',
      Phone: '555-0001',
      Department: 'CS',
    });

    expect(result).toEqual(sampleRecord);
    expect(mockInput).toHaveBeenCalledWith('Name', 'Test');
    expect(mockInput).toHaveBeenCalledWith('Email', 'test@test.com');
  });

  it('handles null optional fields', async () => {
    mockQuery.mockResolvedValue({ recordset: [sampleRecord] });

    await studentRepository.create({
      Name: 'Test',
      Email: 'test@test.com',
    });

    expect(mockInput).toHaveBeenCalledWith('Phone', null);
    expect(mockInput).toHaveBeenCalledWith('Department', null);
  });
});

describe('studentRepository.update', () => {
  it('updates and returns the student', async () => {
    const updated = { ...sampleRecord, Name: 'Updated' };
    mockQuery.mockResolvedValue({ recordset: [updated] });

    const result = await studentRepository.update('1', {
      Name: 'Updated',
      Email: 'test@test.com',
    });

    expect(result).toEqual(updated);
    expect(mockInput).toHaveBeenCalledWith('id', '1');
  });

  it('returns null when student not found', async () => {
    mockQuery.mockResolvedValue({ recordset: [] });

    const result = await studentRepository.update('999', {
      Name: 'Test',
      Email: 'test@test.com',
    });

    expect(result).toBeNull();
  });
});

describe('studentRepository.delete', () => {
  it('returns true when student deleted', async () => {
    mockQuery.mockResolvedValue({ rowsAffected: [1] });

    const result = await studentRepository.delete('1');

    expect(result).toBe(true);
  });

  it('returns false when student not found', async () => {
    mockQuery.mockResolvedValue({ rowsAffected: [0] });

    const result = await studentRepository.delete('999');

    expect(result).toBe(false);
  });
});
