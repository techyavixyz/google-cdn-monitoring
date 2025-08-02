import express from 'express';
import { DateTime } from 'luxon';
import { Logging } from '@google-cloud/logging';
import geoip from 'geoip-lite';
import numeral from 'numeral';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || 'mogi-io';
const logging = new Logging({ projectId });

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { startTime, endTime, limit = 10 } = req.body;
    
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
      pageSize: 500,
    });

    const ipMap = {};
    const countryMap = {};
    const urlMapPerIp = {};
    const timeSeriesMap = {};

    for (const entry of entries) {
      const payload = entry.metadata.jsonPayload || {};
      const httpRequest = entry.metadata.httpRequest || {};
      const remoteIp = payload.remoteIp || httpRequest.remoteIp;
      const timestamp = entry.metadata.timestamp;

      if (!remoteIp) continue;

      ipMap[remoteIp] = (ipMap[remoteIp] || 0) + 1;
      
      // Time series data - group by hour
      const hourKey = DateTime.fromISO(timestamp).startOf('hour').toISO();
      timeSeriesMap[hourKey] = (timeSeriesMap[hourKey] || 0) + 1;

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

    // Format time series data
    const timeSeries = Object.entries(timeSeriesMap)
      .map(([timestamp, requests]) => ({
        timestamp,
        requests: Number(requests)
      }))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Format top IPs
    const topIps = Object.entries(ipMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, parseInt(limit))
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
      .slice(0, parseInt(limit))
      .map(([country, count]) => ({
        country,
        count,
        countFormatted: numeral(count).format('0.0a')
      }));

    res.json({
      topIps,
      topCountries,
      timeSeries,
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

export default router;