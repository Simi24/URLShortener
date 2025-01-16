import { useState } from 'react';
import CommunicationController from '../model/CommunicationController';

const useNetworkRequest = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const communicationController = CommunicationController.getInstance();

    const shortenUrl = async (url: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await communicationController.shortenUrl(url);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unable to shorten URL. Please try again later.'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const retrieveUrl = async (code: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await communicationController.retriveUrl(code);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Unable to retrieve URL. Please try again later.'));
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, shortenUrl, retrieveUrl };
};

export default useNetworkRequest;