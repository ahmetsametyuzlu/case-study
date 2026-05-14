import { Router, Request, Response } from 'express';
import { studentRepository } from '../repositories/student.repository';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const students = await studentRepository.findAll();
    res.json(students);
  } catch (err) {
    console.error('GET /api/students failed:', err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const student = await studentRepository.findById(req.params.id as string);
    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json(student);
  } catch (err) {
    console.error(`GET /api/students/${req.params.id} failed:`, err);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { Name, Email, Phone, Department } = req.body;
    if (!Name || !Email) {
      res.status(400).json({ error: 'Name and Email are required' });
      return;
    }

    const student = await studentRepository.create({ Name, Email, Phone, Department });
    res.status(201).json(student);
  } catch (err) {
    console.error('POST /api/students failed:', err);
    res.status(500).json({ error: 'Failed to create student' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { Name, Email, Phone, Department } = req.body;
    if (!Name || !Email) {
      res.status(400).json({ error: 'Name and Email are required' });
      return;
    }

    const student = await studentRepository.update(req.params.id as string, {
      Name,
      Email,
      Phone,
      Department,
    });
    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json(student);
  } catch (err) {
    console.error(`PUT /api/students/${req.params.id} failed:`, err);
    res.status(500).json({ error: 'Failed to update student' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await studentRepository.delete(req.params.id as string);
    if (!deleted) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(`DELETE /api/students/${req.params.id} failed:`, err);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

export default router;
