export function humanBytes(bytes: number): string {
  const gb = 1024 ** 3;
  const mb = 1024 ** 2;
  const kb = 1024;
  if (bytes >= gb) return `${(bytes / gb).toFixed(3)} GB`;
  if (bytes >= mb) return `${(bytes / mb).toFixed(3)} MB`;
  if (bytes >= kb) return `${(bytes / kb).toFixed(3)} KB`;
  return `${bytes} B`;
}

export function humanNumber(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return n.toString();
}

export function humanNumberShort(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toString();
}

export function humanNumberLarge(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toString();
}
export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}