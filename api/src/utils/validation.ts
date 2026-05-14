export function validateStudentInput(body: { Name?: string; Email?: string }): {
  valid: boolean;
  error?: string;
} {
  if (!body.Name || body.Name.trim() === '') {
    return { valid: false, error: 'Name is required' };
  }
  if (!body.Email || body.Email.trim() === '') {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.Email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

export function formatStudentDate(dateString: string): string {
  return new Date(dateString).toISOString();
}
