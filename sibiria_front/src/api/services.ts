// src/api/services.ts

import axios from 'axios';

export interface Service {
    id: number;
    name: string;
    description?: string;
    price: number;
}

// Правильный путь к ServiceController (Route = "api/[controller]" → "api/Service")
const API_URL = 'https://localhost:7091/api/Service';

/**
 * Получаем список всех доступных дополнительных услуг.
 */
export const fetchAllServices = async (): Promise<Service[]> => {
    const response = await axios.get<Service[]>(API_URL);
    return response.data;
};
