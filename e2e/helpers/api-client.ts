
const API_URL = process.env.API_URL || 'http://localhost:3001';
const BASE = `${API_URL}/api/students`;

export interface Student {
  StudentId?: number;
  Name: string;
  Email: string;
  Phone?: string;
  Department?: string;
  CreatedDate?: string;
}

export async function createStudent(student: Omit<Student, 'StudentId' | 'CreatedDate'>): Promise<Student> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!res.ok) throw new Error(`Failed to create student: ${res.status}`);
  return res.json();
}

export async function getAllStudents(): Promise<Student[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(`Failed to fetch students: ${res.status}`);
  return res.json();
}

export async function deleteStudent(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 404) {
    throw new Error(`Failed to delete student: ${res.status}`);
  }
}

export async function deleteAllStudents(): Promise<void> {
  const students = await getAllStudents();
  for (const student of students) {
    if (student.StudentId) {
      await deleteStudent(student.StudentId);
    }
  }
}

export async function waitForApi(maxRetries = 30, intervalMs = 1000): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${API_URL}/health`);
      if (res.ok) return;
    } catch {
      // API not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error(`API not available at ${API_URL} after ${maxRetries} retries`);
}

