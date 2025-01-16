import { useState } from 'react';
import CommunicationController from '../model/CommunicationController';
import { ShortenedData, RetrievedData } from '../util/types/URLData';

const useNetworkRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const shortenUrl = async (url: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/shorten', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (!response.ok) {
                throw new Error('Something went wrong. Please try again later.');
            }

            const data = await response.json();
            return data;
        } catch (err) {
            throw new Error('Unable to shorten URL. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const retrieveUrl = async (code: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/retrieve/${code}`);
            
            if (!response.ok) {
                throw new Error(
                    response.status === 404 
                        ? 'URL not found. Please check the code and try again.'
                        : 'Something went wrong. Please try again later.'
                );
            }

            const data = await response.json();
            return data;
        } catch (err) {
            throw new Error('Unable to retrieve URL. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, shortenUrl, retrieveUrl };
};

export default useNetworkRequest;