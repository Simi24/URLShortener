import React, { useState } from 'react';
import useNetworkRequest from '@/hooks/useNetworkRequest';
import { URLShortenerForm } from './URLShortenerForm';
import { URLResult } from './URLResult';
import { TabSelector } from './URLTabSelector';
import { ShortenedData, RetrievedData } from '@/util/types/URLData';


const URLShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [activeTab, setActiveTab] = useState<'shorten' | 'retrieve'>('shorten');
  const [shortenedData, setShortenedData] = useState<ShortenedData | null>(null);
  const [retrievedData, setRetrievedData] = useState<RetrievedData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { loading, shortenUrl, retrieveUrl } = useNetworkRequest();

  const BASE_URL = 'http://localhost:8000/';

  const handleShortenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setRetrievedData(null);
    try {
      const result = await shortenUrl(url);
      if (result !== undefined) {
        setShortenedData(result);
        setUrl('');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error 
        ? error.message 
        : 'Failed to shorten URL. Please try again.');
    }
  };

  const extractShortCode = (input: string): string => {
    try {
      const url = new URL(input);
      return url.pathname.slice(1);
    } catch {
      return input;
    }
  };

  const handleRetrieveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setRetrievedData(null);
    try {
      const code = extractShortCode(shortCode);
      const result = await retrieveUrl(code);
      if (result !== undefined) {
        setRetrievedData(result);
        setShortCode('');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error 
        ? error.message 
        : 'Failed to retrieve URL. The short code might not exist.');
    }
  };

  const handleTabChange = (tab: 'shorten' | 'retrieve') => {
    setActiveTab(tab);
    setErrorMessage(null);
    if (tab === 'shorten') {
      setUrl('');
    } else {
      setShortCode('');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto shadow-lg rounded-lg p-6 bg-white dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-center text-gray-900 dark:text-white mb-6">
          URL Shortener
        </h1>
          <img 
            src="/ADK_Logo.jpg" 
            alt="ADK Logo" 
            className="w-32 h-auto mb-8 rounded-full shadow-lg"
          />
      </div>
      <TabSelector activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="mt-6">
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 text-sm">
            {errorMessage}
          </div>
        )}
        
        {activeTab === 'shorten' ? (
          <>
            <URLShortenerForm
              type="shorten"
              value={url}
              onChange={setUrl}
              onSubmit={handleShortenSubmit}
              loading={loading}
            />
            {shortenedData && (
              <URLResult 
                data={shortenedData} 
                mode="shorten" 
                baseUrl={BASE_URL} 
              />
            )}
          </>
        ) : (
          <>
            <URLShortenerForm
              type="retrieve"
              value={shortCode}
              onChange={setShortCode}
              onSubmit={handleRetrieveSubmit}
              loading={loading}
            />
            {retrievedData && (
              <URLResult 
                data={retrievedData} 
                mode="retrieve" 
                baseUrl={BASE_URL} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default URLShortener;