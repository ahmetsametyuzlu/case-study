import type { Student } from '../types/Student';

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: number) => void;
}

export default function StudentList({ students, onEdit, onDelete }: Props) {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <p>No students found. Add your first student!</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.StudentId}>
              <td>{s.StudentId}</td>
              <td>{s.Name}</td>
              <td>{s.Email}</td>
              <td>{s.Phone || '-'}</td>
              <td>{s.Department || '-'}</td>
              <td>{s.CreatedDate ? new Date(s.CreatedDate).toLocaleDateString('tr-TR') : '-'}</td>
              <td className="actions-cell">
                <button className="btn btn-sm btn-edit" onClick={() => onEdit(s)}>
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-delete"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete "${s.Name}"?`)) {
                      onDelete(s.StudentId!);
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
