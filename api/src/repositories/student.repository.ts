import { getPool } from '../config/database';

export interface StudentRecord {
  StudentId: number;
  Name: string;
  Email: string;
  Phone: string | null;
  Department: string | null;
  CreatedDate: Date;
}

export const studentRepository = {
  async findAll(): Promise<StudentRecord[]> {
    const pool = await getPool();
    const result = await pool.request().query<StudentRecord>(`
        SELECT StudentId, Name, Email, Phone, Department, CreatedDate
        FROM Students
        ORDER BY CreatedDate DESC
    `);
    return result.recordset;
  },

  async findById(id: string): Promise<StudentRecord | null> {
    const pool = await getPool();
    const result = await pool.request().input('id', id).query<StudentRecord>(`
        SELECT StudentId, Name, Email, Phone, Department, CreatedDate
        FROM Students
        WHERE StudentId = @id
    `);
    return result.recordset[0] || null;
  },

  async create(data: {
    Name: string;
    Email: string;
    Phone?: string | null;
    Department?: string | null;
  }): Promise<StudentRecord> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('Name', data.Name)
      .input('Email', data.Email)
      .input('Phone', data.Phone || null)
      .input('Department', data.Department || null).query<StudentRecord>(`
        INSERT INTO Students (Name, Email, Phone, Department)
        OUTPUT INSERTED.StudentId, INSERTED.Name, INSERTED.Email, INSERTED.Phone, INSERTED.Department, INSERTED.CreatedDate
        VALUES (@Name, @Email, @Phone, @Department)
      `);
    return result.recordset[0];
  },

  async update(
    id: string,
    data: {
      Name: string;
      Email: string;
      Phone?: string | null;
      Department?: string | null;
    },
  ): Promise<StudentRecord | null> {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', id)
      .input('Name', data.Name)
      .input('Email', data.Email)
      .input('Phone', data.Phone || null)
      .input('Department', data.Department || null).query<StudentRecord>(`
        UPDATE Students
        SET Name = @Name, Email = @Email, Phone = @Phone, Department = @Department
        OUTPUT INSERTED.StudentId, INSERTED.Name, INSERTED.Email, INSERTED.Phone, INSERTED.Department, INSERTED.CreatedDate
        WHERE StudentId = @id
      `);
    return result.recordset[0] || null;
  },

  async delete(id: string): Promise<boolean> {
    const pool = await getPool();
    const result = await pool.request().input('id', id).query(`
        DELETE FROM Students WHERE StudentId = @id
      `);
    return result.rowsAffected[0] > 0;
  },
};
