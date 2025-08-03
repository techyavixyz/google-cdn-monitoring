import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Check if this is first time setup
router.get('/check-setup', async (req, res) => {
  try {
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    const isFirstTimeSetup = parseInt(userCount.rows[0].count) === 0;
    
    res.json({ isFirstTimeSetup });
  } catch (error) {
    console.error('Setup check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Signup (first time setup)
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if any users exist (should be first time setup)
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCount.rows[0].count) > 0) {
      return res.status(409).json({ error: 'Setup already completed' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name',
      [username, email, passwordHash, fullName]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store session in database
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await pool.query(
      'INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [newUser.id, token, expiresAt]
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.full_name
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store session in database
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await pool.query(
      'INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    const userResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    // In a real app, you would send an email here
    // For demo purposes, we'll just return success
    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Find user by email
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'No account found with this email' });
    }

    const user = userResult.rows[0];

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, user.id]
    );

    // Generate new JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store session in database
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await pool.query(
      'INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name
      },
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register (legacy endpoint - kept for compatibility)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name',
      [username, email, passwordHash, fullName]
    );

    const newUser = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Store session in database
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await pool.query(
      'INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [newUser.id, token, expiresAt]
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.full_name
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }
    // Get current user
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newPasswordHash, userId]
    );

    res.json({ 
      message: 'Password changed successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.full_name
      }
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    
    // Remove session from database
    await pool.query('DELETE FROM user_sessions WHERE token_hash = $1', [token]);
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      fullName: req.user.full_name
    }
  });
});

export default router;