import bcrypt from 'bcryptjs';
import pool from '../config/database.js';

export const initializeAdminUser = async () => {
  try {
    // Test database connection first
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    // Check if admin user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      ['admin', 'admin@kloudscope.com']
    );

    if (existingUser.rows.length > 0) {
      console.log('✅ User already exists, skipping creation');
      return;
    }

    // No users exist, this is first time setup
    console.log('🔧 First time setup detected - no users found');
    console.log('💡 Please complete setup through the web interface');
  } catch (error) {
    console.error('❌ Error checking user setup:', error);
    
    // If it's a connection error, provide helpful debugging info
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure PostgreSQL is running: docker-compose up -d');
    } else if (error.code === '28P01') {
      console.error('💡 Authentication failed - check database credentials');
    } else if (error.code === '3D000') {
      console.error('💡 Database does not exist - check database initialization');
    }
  }
};

// Legacy function - kept for backward compatibility
export const createDefaultAdmin = async () => {
  try {
    // Create default admin user (only for development/testing)
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('admin123', saltRounds);

    await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4)',
      ['admin', 'admin@kloudscope.com', passwordHash, 'Administrator']
    );

    console.log('✅ Admin user created successfully (admin/admin123)');
  } catch (error) {
    console.error('❌ Error creating default admin user:', error);
  }
};