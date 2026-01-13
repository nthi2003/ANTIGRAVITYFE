const BASE_URL = 'http://localhost:8080/api/v1';

export const api = {
    getHeaders: () => {
        const token = localStorage.getItem('token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },
    get: async (endpoint: string) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            headers: api.getHeaders(),
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    },
    post: async (endpoint: string, data: any) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: api.getHeaders(),
            body: JSON.stringify(data),
        });
        return api.handleResponse(response);
    },
    put: async (endpoint: string, data: any = {}) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: api.getHeaders(),
            body: JSON.stringify(data),
        });
        return api.handleResponse(response);
    },
    patch: async (endpoint: string, data: any = {}) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: api.getHeaders(),
            body: JSON.stringify(data),
        });
        return api.handleResponse(response);
    },
    delete: async (endpoint: string) => {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: api.getHeaders(),
        });
        return api.handleResponse(response);
    },
    handleResponse: async (response: Response) => {
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/';
        }

        const contentType = response.headers.get("content-type");
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || `API Error: ${response.statusText}`);
        }

        if (response.status === 204) return null;

        if (contentType && contentType.includes("application/json")) {
            return response.json();
        } else {
            return response.text();
        }
    }
};
