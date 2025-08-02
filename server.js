import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { DateTime } from 'luxon';
import monitoring from '@google-cloud/monitoring';
import { Logging } from '@google-cloud/logging';
import geoip from 'geoip-lite';
import numeral from 'numeral';

dotenv.config();

const app = express();
const port = 3001;



app.use(cors());
app.use(express.json());

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'mogi-io';
const client = new monitoring.MetricServiceClient();
const logging = new Logging({ projectId });

function humanBytes(bytes) {
  const gb = 1024 ** 3;
  const mb = 1024 ** 2;
  const kb = 1024;
  if (bytes >= gb) return `${(bytes / gb).toFixed(3)} GB`;
  if (bytes >= mb) return `${(bytes / mb).toFixed(3)} MB`;
  if (bytes >= kb) return `${(bytes / kb).toFixed(3)} KB`;
  return `${bytes} B`;
}

function humanNumber(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return n.toString();
}

async function fetchTimeSeries(metricType, startTime, endTime, alignmentPeriod = 3600) {
  const request = {
    name: client.projectPath(projectId),
    filter: `metric.type = "${metricType}"`,
    interval: {
      startTime: { seconds: startTime.toSeconds() },
      endTime: { seconds: endTime.toSeconds() },
    },
    aggregation: {
      alignmentPeriod: { seconds: alignmentPeriod },
      perSeriesAligner: 'ALIGN_SUM',
      crossSeriesReducer: 'REDUCE_SUM',
      groupByFields: [],
    },
  };

  try {
    const [timeSeries] = await client.listTimeSeries(request);
    return timeSeries.length > 0 ? timeSeries[0] : null;
  } catch (e) {
    console.warn(`⚠️ Metric ${metricType} not found: ${e.message}`);
    return null;
  }
}

async function fetchSum(metricType, startTime, endTime) {
  const timeSeries = await fetchTimeSeries(metricType, startTime, endTime, 86400);
  if (!timeSeries || timeSeries.points.length === 0) return 0;
  return Number(timeSeries.points[0].value.int64Value || 0);
}

app.post('/api/metrics', async (req, res) => {
  try {
    const { startTime, endTime, granularity } = req.body;
    
    const start = DateTime.fromISO(startTime);
    const end = DateTime.fromISO(endTime);
    
    // Determine alignment period based on time range
    const diffHours = end.diff(start, 'hours').hours;
    let alignmentPeriod = 3600; // 1 hour default
    
    if (diffHours <= 6) alignmentPeriod = 300; // 5 minutes
    else if (diffHours <= 24) alignmentPeriod = 3600; // 1 hour
    else if (diffHours <= 168) alignmentPeriod = 86400; // 1 day
    else alignmentPeriod = 604800; // 1 week

    const [requestsTimeSeries, bytesTimeSeries] = await Promise.all([
      fetchTimeSeries('loadbalancing.googleapis.com/https/request_count', start, end, alignmentPeriod),
      fetchTimeSeries('loadbalancing.googleapis.com/https/response_bytes_count', start, end, alignmentPeriod)
    ]);

    // Get totals
    const totalRequests = await fetchSum('loadbalancing.googleapis.com/https/request_count', start, end);
    const totalBytes = await fetchSum('loadbalancing.googleapis.com/https/response_bytes_count', start, end);

    // Format time series data
    const formatTimeSeries = (timeSeries) => {
      if (!timeSeries || !timeSeries.points) return [];
      return timeSeries.points.map(point => ({
        timestamp: DateTime.fromSeconds(Number(point.interval.endTime.seconds)).toISO(),
        value: Number(point.value.int64Value || 0)
      })).reverse();
    };

    const requestsData = formatTimeSeries(requestsTimeSeries);
    const bytesData = formatTimeSeries(bytesTimeSeries);

    res.json({
      totals: {
        requests: totalRequests,
        bytes: totalBytes,
        requestsFormatted: humanNumber(totalRequests),
        bytesFormatted: humanBytes(totalBytes)
      },
      timeSeries: {
        requests: requestsData,
        bytes: bytesData
      },
      timeRange: {
        start: start.toISO(),
        end: end.toISO(),
        duration: `${diffHours.toFixed(1)}h`
      }
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

app.post('/api/analytics', async (req, res) => {
  try {
    const { startTime, endTime } = req.body;
    
    const start = DateTime.fromISO(startTime);
    const end = DateTime.fromISO(endTime);
    
    const filter = `
      resource.type="http_load_balancer"
      jsonPayload.remoteIp!=""
      timestamp >= "${start.toISO()}"
      timestamp <= "${end.toISO()}"
    `;

    const [entries] = await logging.getEntries({
      filter,
      pageSize: 5000,
    });

    const ipMap = {};
    const countryMap = {};
    const urlMapPerIp = {};

    for (const entry of entries) {
      const payload = entry.metadata.jsonPayload || {};
      const httpRequest = entry.metadata.httpRequest || {};
      const remoteIp = payload.remoteIp || httpRequest.remoteIp;

      if (!remoteIp) continue;

      ipMap[remoteIp] = (ipMap[remoteIp] || 0) + 1;

      const requestUrl = payload.requestUrl || httpRequest.requestUrl || 
                        payload.requestUrlPath || httpRequest.requestUrlPath || 
                        payload.requestPath || payload.request?.url || 'unknown';

      // Track most requested URLs per IP
      if (!urlMapPerIp[remoteIp]) urlMapPerIp[remoteIp] = {};
      urlMapPerIp[remoteIp][requestUrl] = (urlMapPerIp[remoteIp][requestUrl] || 0) + 1;

      // Country tracking
      const location = geoip.lookup(remoteIp);
      const country = location?.country;
      if (country) {
        countryMap[country] = (countryMap[country] || 0) + 1;
      }
    }

    // Format top IPs
    const topIps = Object.entries(ipMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, count]) => {
        const location = geoip.lookup(ip);
        const region = location
          ? `${location.city || location.region || ''}, ${location.country || ''}`.replace(/^[,\s]+|[,\s]+$/g, '')
          : 'Unknown';

        // Get top requested URL for this IP
        const urlCounts = urlMapPerIp[ip] || {};
        const [topUrl = 'unknown'] = Object.entries(urlCounts).sort((a, b) => b[1] - a[1])[0] || [];

        return {
          ip,
          count,
          countFormatted: numeral(count).format('0.0a'),
          region,
          topUrl,
          location: location ? {
            city: location.city,
            region: location.region,
            country: location.country,
            ll: location.ll
          } : null
        };
      });

    // Format top countries
    const topCountries = Object.entries(countryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({
        country,
        count,
        countFormatted: numeral(count).format('0.0a')
      }));

    res.json({
      topIps,
      topCountries,
      totalEntries: entries.length,
      timeRange: {
        start: start.toISO(),
        end: end.toISO(),
        duration: `${end.diff(start, 'hours').hours.toFixed(1)}h`
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

app.listen(port, () => {
  console.log(`🚀 CDN Monitoring API running on http://localhost:${port}`);
});