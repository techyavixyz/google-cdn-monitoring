export interface MetricData {
  timestamp: string;
  value: number;
}

export interface CDNMetrics {
  totals: {
    requests: number;
    bytes: number;
    requestsFormatted: string;
    bytesFormatted: string;
  };
  timeSeries: {
    requests: MetricData[];
    bytes: MetricData[];
  };
  timeRange: {
    start: string;
    end: string;
    duration: string;
  };
}

export interface TimeRange {
  label: string;
  value: string;
  hours?: number;
  start?: Date;
  end?: Date;
}

export interface AnalyticsData {
  topIps: {
    ip: string;
    count: number;
    countFormatted: string;
    region: string;
    topUrl: string;
    location: {
      city: string;
      region: string;
      country: string;
      ll: [number, number];
    } | null;
  }[];
  topCountries: {
    country: string;
    count: number;
    countFormatted: string;
  }[];
  timeSeries: {
    timestamp: string;
    requests: number;
  }[];
  totalEntries: number;
  timeRange: {
    start: string;
    end: string;
    duration: string;
  };
}