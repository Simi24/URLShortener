import React from 'react';
import { URLData } from '@/util/types/URLData';
import { useToast } from '@/hooks/use-toast';
import { Copy, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

interface URLResultProps {
  data: URLData;
  mode: 'shorten' | 'retrieve';
  baseUrl: string;
}

export const URLResult: React.FC<URLResultProps> = ({ data, mode, baseUrl }) => {
  const [visits, setVisits] = useState(data.visits);
  const { toast } = useToast();
  const shortUrl = baseUrl + data.short_code;
  const displayUrl = mode === 'shorten' ? shortUrl : data.original_url;
  const redirectUrl = `http://localhost:8000/${data.short_code}`;

  useEffect(() => {
    setVisits(data.visits);
  }, [data.visits]);

  const handleCopyUrl = (textToCopy: string) => {
    console.log('copying', textToCopy);
    navigator.clipboard.writeText(textToCopy);
    toast({
      duration: 2000,
      title: "Copied!",
      className: "bg-foreground text-background border-border dark:bg-background dark:text-white"
    });
  };

  console.log('data', data);

  const handleRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      window.open(redirectUrl, '_blank');
      setVisits(prev => prev + 1);
    } catch (error) {
      console.error('Failed to redirect:', error);
      toast({
        duration: 2000,
        title: "Error",
        description: "Failed to open URL",
        variant: "destructive"
      });
    }
  };

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
      ) : (
        <a
          onClick={handleRedirect}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
          title="Open URL"
        >
          <ExternalLink className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </a>
      )}
    </div>
  </div>
  {mode === 'shorten' && (
    <div className="text-sm text-gray-500 dark:text-gray-300 mt-2">
      Visits: <span className="font-medium">{visits}</span>
    </div>
  )}
</div>
  );
};