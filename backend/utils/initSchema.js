// import pool from '../config/database.js';

// export const initializeSchema = async () => {
//   try {
//     // Create users table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         username TEXT UNIQUE NOT NULL,
//         email TEXT UNIQUE NOT NULL,
//         password_hash TEXT NOT NULL,
//         full_name TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     // Create user_sessions table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS user_sessions (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         token_hash TEXT NOT NULL,
//         expires_at TIMESTAMP NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     console.log('✅ Database schema initialized');
//   } catch (error) {
//     console.error('❌ Failed to initialize schema:', error);
//   }
// };

import pool from '../config/database.js';

export const initializeSchema = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Conditionally add updated_at column if not exists
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name='users' AND column_name='updated_at'
        ) THEN
          ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        END IF;
      END;
      $$;
    `);

    // Create trigger function to auto-update 'updated_at'
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Conditionally attach trigger if not exists
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at'
        ) THEN
          CREATE TRIGGER set_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
        END IF;
      END
      $$;
    `);

    // Create user_sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token_hash TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✅ Database schema initialized');
  } catch (error) {
    console.error('❌ Failed to initialize schema:', error);
  }
};
