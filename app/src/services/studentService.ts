import type { Student } from '../types/Student';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const BASE = `${API_URL}/api/students`;

export const studentService = {
  async getAll(): Promise<Student[]> {
    const res = await fetch(BASE);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  async getById(id: number): Promise<Student> {
    const res = await fetch(`${BASE}/${id}`);
    if (!res.ok) throw new Error('Student not found');
    return res.json();
  },

  async create(student: Student): Promise<Student> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    if (!res.ok) throw new Error('Failed to create student');
    return res.json();
  },

  async update(id: number, student: Student): Promise<Student> {
    const res = await fetch(`${BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
    });
    if (!res.ok) throw new Error('Failed to update student');
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete student');
  },
};
