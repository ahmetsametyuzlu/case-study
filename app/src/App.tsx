import { useState, useEffect } from 'react';
import type { Student } from './types/Student';
import { studentService } from './services/studentService';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import './App.css';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (err) {
      setError('Failed to load students. Is the API running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (student: Student) => {
    try {
      setError(null);
      if (editingStudent?.StudentId) {
        await studentService.update(editingStudent.StudentId, student);
      } else {
        await studentService.create(student);
      }
      setShowForm(false);
      setEditingStudent(null);
      await loadStudents();
    } catch (err) {
      setError('Failed to save student');
      console.error(err);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setError(null);
      await studentService.delete(id);
      await loadStudents();
    } catch (err) {
      setError('Failed to delete student');
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingStudent(null);
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Student Management</h1>
        <p>Simple CRUD Application</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="alert alert-error">
            {error}
            <button className="alert-close" onClick={() => setError(null)}>
              ×
            </button>
          </div>
        )}

        {showForm ? (
          <StudentForm
            key={editingStudent?.StudentId ?? 'new'}
            student={editingStudent}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <>
            <div className="toolbar">
              <button className="btn btn-primary" onClick={handleAdd}>
                Add Student
              </button>
              <span className="student-count">
                Total: {students.length} student{students.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="loading">Loading students...</div>
            ) : (
              <StudentList students={students} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
