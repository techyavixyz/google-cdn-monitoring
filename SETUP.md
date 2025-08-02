# KloudScope Setup Guide

## Prerequisites

1. **Docker & Docker Compose** - For running PostgreSQL
2. **Node.js 18+** - For running the backend and frontend
3. **Google Cloud Project** - With CDN and Load Balancer configured
4. **Google Cloud Authentication** - Service account or gcloud CLI

## Step 1: Database Setup

### Start PostgreSQL with Docker

```bash
# Start PostgreSQL container
docker-compose up -d

# Verify PostgreSQL is running
docker-compose ps

# Check logs if needed
docker-compose logs postgres
```

The database will be automatically initialized with:
- Database: `kloudscope`
- User: `kloudscope_user`
- Password: `kloudscope_password`
- Default admin user: `admin` / `admin123`

### Verify Database Connection

```bash
# Connect to PostgreSQL (optional)
docker exec -it kloudscope-postgres psql -U kloudscope_user -d kloudscope

# List tables
\dt

# Check users table
SELECT * FROM users;

# Exit
\q
```

## Step 2: Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your settings
nano .env
```

**Required Environment Variables:**

```env
NODE_ENV=development
DATABASE_URL=postgresql://kloudscope_user:kloudscope_password@localhost:5432/kloudscope
JWT_SECRET=your-super-secret-jwt-key-change-in-production-make-it-very-long-and-random
GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
```

### Google Cloud Authentication

Choose one of these options:

**Option 1: Service Account Key**
```bash
# Download service account key from Google Cloud Console
# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account-key.json"
```

**Option 2: gcloud CLI**
```bash
# Install gcloud CLI if not already installed
# Authenticate
gcloud auth application-default login
```

### Start Backend

```bash
cd backend
npm run dev
```

You should see:
```
🚀 KloudScope Backend running on http://localhost:3001
📊 CDN Analytics API ready
🔐 Authentication enabled
```

## Step 3: Frontend Setup

### Install Dependencies

```bash
# From project root
npm install
```

### Start Frontend

```bash
npm run dev
```

The frontend will be available at: http://localhost:5173

## Step 4: Test the Application

1. **Open Browser**: Navigate to http://localhost:5173
2. **Login**: Use credentials `admin` / `admin123`
3. **Test Metrics**: Go to CDN Metrics page
4. **Test Analytics**: Go to Traffic Analytics page

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart postgres

# Check PostgreSQL logs
docker-compose logs postgres
```

### Backend Authentication Issues

```bash
# Verify Google Cloud credentials
gcloud auth application-default print-access-token

# Check if your project has the required APIs enabled
gcloud services list --enabled --filter="name:monitoring.googleapis.com OR name:logging.googleapis.com"
```

### Frontend Connection Issues

- Ensure backend is running on port 3001
- Check browser console for CORS errors
- Verify API endpoints in browser network tab

## Production Deployment

### Database
- Use managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
- Update `DATABASE_URL` in production environment

### Backend
- Deploy to cloud platform (Google Cloud Run, AWS ECS, etc.)
- Set production environment variables
- Use proper JWT secret
- Enable HTTPS

### Frontend
- Build: `npm run build`
- Deploy `dist/` folder to static hosting (Netlify, Vercel, etc.)
- Update API endpoints to production backend URL

## Security Notes

1. **Change default passwords** in production
2. **Use strong JWT secret** (64+ characters)
3. **Enable HTTPS** for all endpoints
4. **Restrict database access** to application only
5. **Use environment variables** for all secrets
6. **Enable Google Cloud IAM** with minimal permissions

## Support

For issues or questions:
- Check logs: `docker-compose logs`
- Verify environment variables
- Ensure Google Cloud permissions are correct
- Test database connectivity manually