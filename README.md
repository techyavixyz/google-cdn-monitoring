# Google Cloud CDN Monitoring Dashboard

A beautiful, production-ready full-stack web application for monitoring Google Cloud CDN usage with stunning tech UI and adjustable time frames.

## Features

- **Real-time CDN Metrics**: Monitor requests and bytes served through Google Cloud CDN
- **Flexible Time Ranges**: Choose from preset intervals (1h, 6h, 24h, 7d, 30d) or set custom date/time ranges
- **Beautiful Visualizations**: Interactive charts and metrics cards with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Modern Tech UI**: Dark theme with gradients, backdrop blur, and micro-interactions

## Prerequisites

1. **Google Cloud Project**: You need a Google Cloud project with CDN and Load Balancer configured
2. **Authentication**: Set up Google Cloud authentication:
   ```bash
   # Option 1: Using service account key
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/your-service-account-key.json"
   
   # Option 2: Using gcloud CLI
   gcloud auth application-default login
   ```

## Setup

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env and set your GOOGLE_CLOUD_PROJECT_ID
   ```

3. **Run the application**:
   ```bash
   # Start both backend and frontend
   npm run dev:full
   
   # Or run separately:
   # Terminal 1: Backend API
   npm run server
   
   # Terminal 2: Frontend
   npm run dev
   ```

4. **Access the dashboard**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Architecture

### Backend (`server.js`)
- Express.js API server
- Google Cloud Monitoring client integration
- RESTful endpoint for fetching CDN metrics
- Automatic time series aggregation based on time range

### Frontend (React + TypeScript)
- Modern React with TypeScript
- Tailwind CSS for styling
- Custom hooks for data fetching
- Responsive component architecture
- Real-time data visualization

## API Endpoints

### POST `/api/metrics`
Fetch CDN metrics for a specific time range.

**Request Body:**
```json
{
  "startTime": "2024-01-01T00:00:00.000Z",
  "endTime": "2024-01-02T00:00:00.000Z"
}
```

**Response:**
```json
{
  "totals": {
    "requests": 1500000,
    "bytes": 2500000000,
    "requestsFormatted": "1.50M",
    "bytesFormatted": "2.33 GB"
  },
  "timeSeries": {
    "requests": [...],
    "bytes": [...]
  },
  "timeRange": {
    "start": "2024-01-01T00:00:00.000Z",
    "end": "2024-01-02T00:00:00.000Z",
    "duration": "24.0h"
  }
}
```

## Time Range Options

### Preset Ranges
- **1 Hour**: Last 60 minutes
- **6 Hours**: Last 6 hours
- **24 Hours**: Last 24 hours
- **7 Days**: Last week
- **30 Days**: Last month

### Custom Ranges
Set any start and end date/time combination using the custom time picker.

## Deployment

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Deploy backend**: Deploy `server.js` to your preferred Node.js hosting platform
3. **Deploy frontend**: Deploy the `dist/` folder to a static hosting service
4. **Update API endpoint**: Modify the API calls in the frontend to point to your deployed backend

## Monitoring Metrics

The dashboard tracks these Google Cloud CDN metrics:
- `loadbalancing.googleapis.com/https/request_count`: Total HTTPS requests
- `loadbalancing.googleapis.com/https/response_bytes_count`: Total bytes served

## Troubleshooting

1. **Authentication Issues**: Ensure Google Cloud credentials are properly configured
2. **No Data**: Verify your project has CDN traffic and proper monitoring enabled
3. **API Errors**: Check the browser console and server logs for detailed error messages

## Contributing

Feel free to submit issues and enhancement requests!