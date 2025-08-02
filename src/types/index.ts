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