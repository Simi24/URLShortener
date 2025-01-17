import axios, {AxiosInstance} from "axios";

class CommunicationController{
    private static instance: CommunicationController;
    private axiosInstance: AxiosInstance;

    private constructor(baseURL: string = 'http://localhost:8000'){
        this.axiosInstance = axios.create({
            baseURL: baseURL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    public static getInstance(): CommunicationController{
        if (!CommunicationController.instance){
            CommunicationController.instance = new CommunicationController();
        }
        return CommunicationController.instance;
    }

    public async shortenUrl(url: string): Promise<any>{
        try {
            const response = await this.axiosInstance.post('/api/shorten', {
                original_url: url
            });
            return response.data;
        } catch (err) {
            throw new Error('Error shortening URL. Please try again.');
        }
    }

    public async retriveUrl(shortCode: string): Promise<any>{
        try {
            const response = await this.axiosInstance.get(`/api/url/${shortCode}`);
            return response.data;
        } catch (err) {
            throw new Error('Error retriving URL. Please try again.');
        }
    }

    public async getStats(shortCode: string): Promise<any>{
        try {
            const response = await this.axiosInstance.get(`/api/stats/${shortCode}`);
            return response.data;
        } catch (err) {
            throw new Error('Error getting stats. Please try again.');
        }
    }

    public async redirectUrl(shortCode: string): Promise<string> {
        try {
            const response = await this.axiosInstance.get(`/${shortCode}`, {
                maxRedirects: 0,
                validateStatus: (status) => status === 302 || status === 200
            });
            return response.headers.location || response.data.url;
        } catch (err) {
            throw new Error('Error redirecting URL. Please try again.');
        }
    }

}

export default CommunicationController;