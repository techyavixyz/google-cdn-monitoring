@@ .. @@
 -- Create database and user for KloudScope
+CREATE USER kloudscope_user WITH PASSWORD 'kloudscope_password';
 CREATE DATABASE kloudscope OWNER kloudscope_user;
+GRANT ALL PRIVILEGES ON DATABASE kloudscope TO kloudscope_user;
+
+-- Connect to the kloudscope database
+\c kloudscope;
+
+-- Grant schema privileges
+GRANT ALL ON SCHEMA public TO kloudscope_user;
+GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO kloudscope_user;
+GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO kloudscope_user;
+
+-- Set default privileges for future objects
+ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO kloudscope_user;
+ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO kloudscope_user;