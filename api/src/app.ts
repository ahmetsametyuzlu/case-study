import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/student.routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/students', studentRoutes);

app.get('/api', (_req, res) => {
  res.json({ message: 'CaseStudy API is running!' });
});

export default app;
