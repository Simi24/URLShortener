import React from 'react';

interface URLShortenerFormProps {
  type: 'shorten' | 'retrieve';
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export const URLShortenerForm: React.FC<URLShortenerFormProps> = ({
  type,
  value,
  onChange,
  onSubmit,
  loading
}) => {
  const isShorten = type === 'shorten';
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label 
          htmlFor={type === 'shorten' ? 'url' : 'shortCode'} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {isShorten ? 'Enter URL to shorten' : 'Enter short code or URL'}
        </label>
        <input
          id={isShorten ? 'url' : 'shortCode'}
          type={isShorten ? 'url' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isShorten ? 'https://example/of/a/very/very/long/url.com' : 'abc123 or http://shorturl.com/abc123'}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   bg-white dark:bg-slate-800
                   text-gray-900 dark:text-gray-100
                   placeholder-gray-500 dark:placeholder-gray-400"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white py-3 px-4 rounded-lg transition-colors ${
          isShorten 
            ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800' 
            : 'bg-green-600 hover:bg-green-700 disabled:bg-green-300 dark:disabled:bg-green-800'
        }`}
      >
        {loading 
          ? (isShorten ? 'Shortening...' : 'Retrieving...') 
          : (isShorten ? 'Shorten URL' : 'Retrieve Original URL')
        }
      </button>
    </form>
  );
};