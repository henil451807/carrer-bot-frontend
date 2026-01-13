/**
 * API Service for communicating with the Career Bot backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ChatRequest {
    message: string;
}

export interface ChatResponse {
    response: string;
    type: 'rag' | 'greeting' | 'fallback' | 'error';
    timestamp: string;
}

export interface HealthResponse {
    status: string;
    message: string;
}

/**
 * Send a message to the chatbot
 */
export const sendMessage = async (message: string): Promise<ChatResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ChatResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

/**
 * Check API health
 */
export const checkHealth = async (): Promise<HealthResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: HealthResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking health:', error);
        throw error;
    }
};
