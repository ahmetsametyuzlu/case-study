export interface Student {
  StudentId?: number;
  Name: string;
  Email: string;
  Phone: string;
  Department: string;
  CreatedDate?: string;
}

export const emptyStudent: Student = {
  Name: '',
  Email: '',
  Phone: '',
  Department: '',
};
