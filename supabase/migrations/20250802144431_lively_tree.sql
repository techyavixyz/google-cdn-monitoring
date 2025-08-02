-- Create database and user for KloudScope
CREATE USER kloudscope_user WITH PASSWORD 'kloudscope_password';
CREATE DATABASE kloudscope OWNER kloudscope_user;
GRANT ALL PRIVILEGES ON DATABASE kloudscope TO kloudscope_user;

-- Connect to the kloudscope database
\c kloudscope;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO kloudscope_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO kloudscope_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO kloudscope_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO kloudscope_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO kloudscope_user;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table for JWT token management
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON user_sessions(token_hash);

-- Grant permissions on the tables to kloudscope_user
GRANT ALL PRIVILEGES ON TABLE users TO kloudscope_user;
GRANT ALL PRIVILEGES ON TABLE user_sessions TO kloudscope_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO kloudscope_user;