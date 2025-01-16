// Base interface for URL data
export interface URLData {
  short_code: string;
  original_url: string;
  visits: number;
}

// Type aliases for specific operations
export type ShortenedData = URLData;
export type RetrievedData = URLData;

// Props interfaces for components
export interface URLShortenerFormProps {
  type: 'shorten' | 'retrieve';
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export interface URLResultProps {
  data: URLData;
  mode: 'shorten' | 'retrieve';
  baseUrl: string;
}

export interface TabSelectorProps {
  activeTab: 'shorten' | 'retrieve';
  onTabChange: (tab: 'shorten' | 'retrieve') => void;
}

// Utility type for tab options
export type TabOption = 'shorten' | 'retrieve';