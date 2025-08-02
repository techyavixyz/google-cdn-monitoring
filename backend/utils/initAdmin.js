import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

export const initializeAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      ['admin', 'admin@kloudscope.com']
    );

    if (existingUser.rows.length > 0) {
      console.log('✅ Admin user already exists, skipping creation');
      return;
    }

    // Create admin user
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('admin123', saltRounds);

    await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4)',
      ['admin', 'admin@kloudscope.com', passwordHash, 'Administrator']
    );

    console.log('✅ Admin user created successfully (admin/admin123)');
  } catch (error) {
    console.error('❌ Error initializing admin user:', error.message);
  }
};