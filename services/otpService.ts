
interface OTPResponse {
    message: string;
    status: string;
}

const API_KEY = import.meta.env.VITE_AUTHENTICA_API_KEY || '';
const BASE_URL = 'https://api.authentica.sa/api/v2';

export const sendOTP = async (phone: string): Promise<boolean> => {
    try {
        const response = await fetch(`${BASE_URL}/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': API_KEY,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                method: 'sms',
                phone: phone,
                // template_id: 1 // Optional, using default
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OTP Send Error:', errorData);
            throw new Error(errorData.message || 'Failed to send OTP');
        }

        return true;
    } catch (error) {
        console.error('OTP Service Error:', error);
        throw error;
    }
};

export const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
    try {
        const response = await fetch(`${BASE_URL}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': API_KEY,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                phone: phone,
                otp: otp
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('OTP Verify Error:', errorData);
            // For now, if the API fails or is not real, we might want to allow a "bypass" for testing if the user hasn't set up the key. 
            // But adhering to instructions, I will throw.
            throw new Error(errorData.message || 'Invalid OTP');
        }

        // Check response body status if needed, assuming 200 OK means verified.
        return true;
    } catch (error) {
        console.error('OTP verification failed:', error);
        throw error;
    }
};
