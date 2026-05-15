import dotenv from 'dotenv';
import { getPool } from './config/database';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await getPool();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
