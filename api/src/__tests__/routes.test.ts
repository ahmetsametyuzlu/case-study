import request from 'supertest';
import app from '../app';
import { studentRepository } from '../repositories/student.repository';

jest.mock('../repositories/student.repository');

const mockedRepo = studentRepository as jest.Mocked<typeof studentRepository>;

const sampleStudent = {
  StudentId: 1,
  Name: 'Ahmet Yilmaz',
  Email: 'ahmet@example.com',
  Phone: '555-0001',
  Department: 'Computer Science',
  CreatedDate: new Date('2026-01-15'),
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('GET /api/students', () => {
  it('returns all students', async () => {
    mockedRepo.findAll.mockResolvedValue([sampleStudent]);

    const res = await request(app).get('/api/students');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].Name).toBe('Ahmet Yilmaz');
  });

  it('returns 500 on db error', async () => {
    mockedRepo.findAll.mockRejectedValue(new Error('db down'));

    const res = await request(app).get('/api/students');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to fetch students');
  });
});

describe('GET /api/students/:id', () => {
  it('returns a student by id', async () => {
    mockedRepo.findById.mockResolvedValue(sampleStudent);

    const res = await request(app).get('/api/students/1');

    expect(res.status).toBe(200);
    expect(res.body.Name).toBe('Ahmet Yilmaz');
  });

  it('returns 404 when student not found', async () => {
    mockedRepo.findById.mockResolvedValue(null);

    const res = await request(app).get('/api/students/999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Student not found');
  });

  it('returns 500 on db error', async () => {
    mockedRepo.findById.mockRejectedValue(new Error('db down'));

    const res = await request(app).get('/api/students/1');

    expect(res.status).toBe(500);
  });
});

describe('POST /api/students', () => {
  it('creates a student with valid data', async () => {
    mockedRepo.create.mockResolvedValue(sampleStudent);

    const res = await request(app)
      .post('/api/students')
      .send({ Name: 'Ahmet Yilmaz', Email: 'ahmet@example.com' });

    expect(res.status).toBe(201);
    expect(res.body.Name).toBe('Ahmet Yilmaz');
    expect(mockedRepo.create).toHaveBeenCalledWith({
      Name: 'Ahmet Yilmaz',
      Email: 'ahmet@example.com',
      Phone: undefined,
      Department: undefined,
    });
  });

  it('returns 400 when Name is missing', async () => {
    const res = await request(app).post('/api/students').send({ Email: 'ahmet@example.com' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Name and Email are required');
    expect(mockedRepo.create).not.toHaveBeenCalled();
  });

  it('returns 400 when Email is missing', async () => {
    const res = await request(app).post('/api/students').send({ Name: 'Ahmet' });

    expect(res.status).toBe(400);
  });

  it('returns 400 when body is empty', async () => {
    const res = await request(app).post('/api/students').send({});

    expect(res.status).toBe(400);
  });

  it('returns 500 on db error', async () => {
    mockedRepo.create.mockRejectedValue(new Error('db down'));

    const res = await request(app)
      .post('/api/students')
      .send({ Name: 'Test', Email: 'test@test.com' });

    expect(res.status).toBe(500);
  });
});

describe('PUT /api/students/:id', () => {
  it('updates a student', async () => {
    const updated = { ...sampleStudent, Name: 'Updated Name' };
    mockedRepo.update.mockResolvedValue(updated);

    const res = await request(app)
      .put('/api/students/1')
      .send({ Name: 'Updated Name', Email: 'ahmet@example.com' });

    expect(res.status).toBe(200);
    expect(res.body.Name).toBe('Updated Name');
  });

  it('returns 400 when Name is missing', async () => {
    const res = await request(app).put('/api/students/1').send({ Email: 'ahmet@example.com' });

    expect(res.status).toBe(400);
    expect(mockedRepo.update).not.toHaveBeenCalled();
  });

  it('returns 400 when Email is missing', async () => {
    const res = await request(app).put('/api/students/1').send({ Name: 'Ahmet' });

    expect(res.status).toBe(400);
  });

  it('returns 404 when student not found', async () => {
    mockedRepo.update.mockResolvedValue(null);

    const res = await request(app)
      .put('/api/students/999')
      .send({ Name: 'Test', Email: 'test@test.com' });

    expect(res.status).toBe(404);
  });

  it('returns 500 on db error', async () => {
    mockedRepo.update.mockRejectedValue(new Error('db down'));

    const res = await request(app)
      .put('/api/students/1')
      .send({ Name: 'Test', Email: 'test@test.com' });

    expect(res.status).toBe(500);
  });
});

describe('DELETE /api/students/:id', () => {
  it('deletes a student', async () => {
    mockedRepo.delete.mockResolvedValue(true);

    const res = await request(app).delete('/api/students/1');

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Student deleted successfully');
  });

  it('returns 404 when student not found', async () => {
    mockedRepo.delete.mockResolvedValue(false);

    const res = await request(app).delete('/api/students/999');

    expect(res.status).toBe(404);
  });

  it('returns 500 on db error', async () => {
    mockedRepo.delete.mockRejectedValue(new Error('db down'));

    const res = await request(app).delete('/api/students/1');

    expect(res.status).toBe(500);
  });
});

describe('GET /health', () => {
  it('returns health status', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});

describe('GET /api', () => {
  it('returns api info', async () => {
    const res = await request(app).get('/api');

    expect(res.status).toBe(200);
    expect(res.body.message).toContain('running');
  });
});
