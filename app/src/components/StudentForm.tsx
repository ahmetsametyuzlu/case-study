import { useState } from 'react';
import type { Student } from '../types/Student';
import { emptyStudent } from '../types/Student';

interface Props {
  student: Student | null;
  onSave: (student: Student) => void;
  onCancel: () => void;
}

export default function StudentForm({ student, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Student>(student ? { ...student } : emptyStudent);
  const isEdit = !!student?.StudentId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="form-card">
      <h2>{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="Name">Name *</label>
          <input
            id="Name"
            name="Name"
            type="text"
            value={form.Name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Email">Email *</label>
          <input
            id="Email"
            name="Email"
            type="email"
            value={form.Email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="Phone">Phone</label>
          <input
            id="Phone"
            name="Phone"
            type="text"
            value={form.Phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="Department">Department</label>
          <input
            id="Department"
            name="Department"
            type="text"
            value={form.Department}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update' : 'Create'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
