import pg from 'pg';
const { Pool } = pg;

const connection = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  ssl: {
    rejectUnauthorized: false,
  },
})

connection.connect()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Error connecting to the database:', err))

export default connection;
