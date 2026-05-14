import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: sql.config = {
  server: process.env.DB_HOST as string,
  port: parseInt(process.env.DB_PORT || '1433', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function migrate() {
  const dbName = process.env.DB_NAME || 'CaseStudyDB';

  console.log(`Migrating database: ${dbName}`);

  const masterPool = await sql.connect({ ...dbConfig, database: 'master' });
  await masterPool.request().query(`
    IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${dbName}')
    BEGIN
      CREATE DATABASE [${dbName}]
    END
  `);
  await masterPool.close();

  const pool = await sql.connect(dbConfig);
  await pool.request().query(`
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Students' AND xtype='U')
    BEGIN
      CREATE TABLE Students (
        StudentId INT PRIMARY KEY IDENTITY(1,1),
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100) NOT NULL,
        Phone NVARCHAR(20),
        Department NVARCHAR(50),
        CreatedDate DATETIME DEFAULT GETDATE()
      )
    END
  `);
  await pool.close();

  console.log('Migration completed successfully');
}

migrate()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
