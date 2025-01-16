import React from 'react';
import { URLData } from '@/util/types/URLData';
import { Copy, ExternalLink } from 'lucide-react';

interface URLResultProps {
  data: URLData;
  mode: 'shorten' | 'retrieve';
  baseUrl: string;
}

export const URLResult: React.FC<URLResultProps> = ({ data, mode, baseUrl }) => {
  const handleCopyUrl = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
  };

  const shortUrl = baseUrl + data.short_code;
  const displayUrl = mode === 'shorten' ? shortUrl : data.original_url;
  
  return (
    <div className="w-full mt-6 bg-white dark:bg-slate-800 p-6 rounded-lg space-y-4">
      <div className="flex items-center justify-between p-4 rounded-lg">
        <div className="flex-1 mr-4">
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
            {mode === 'shorten' ? 'Shortened URL' : 'Original URL'}
          </p>
          <p className="text-lg font-medium break-all text-gray-900 dark:text-white">
            {displayUrl}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleCopyUrl(displayUrl)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            title="Copy URL"
          >
            <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          {mode === 'retrieve' ? (
          <a
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
            title="Open URL"
          >
            <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </a>
          ) : null}
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Visits: <span className="font-medium">{data.visits}</span>
      </div>
    </div>
  );
};