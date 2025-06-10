// src/api/rooms.ts

import axios from 'axios';
import type { Room } from '../types/room';

const API_URL = "https://localhost:7091/api/Rooms";
const ROOM_TYPES_URL = "https://localhost:7091/api/RoomTypes";

export interface RoomType {
    id: number;
    name: string;
    description?: string;
}

export interface FetchAvailableParams {
    checkIn: string;          // строка в ISO-формате, например "2023-04-20T14:00:00"
    checkOut: string;         // строка в ISO-формате, например "2023-04-23T12:00:00"
    roomTypeId?: number;      // если не указан — все типы
    guests: number;           // количество гостей >= 1
}

/**
 * Получаем все типы комнат.
 */
export const fetchRoomTypes = async (): Promise<RoomType[]> => {
    const response = await axios.get<RoomType[]>(ROOM_TYPES_URL);
    return response.data;
};

/**
 * Получаем все комнаты (на будущее, если понадобится).
 */
export const fetchFeaturedRooms = async (): Promise<Room[]> => {
    const response = await axios.get<Room[]>(API_URL);
    return response.data;
};

/**
 * Получаем одну комнату по ID.
 */
export const fetchRoomById = async (id: number): Promise<Room> => {
    const response = await axios.get<Room>(`${API_URL}/${id}`);
    return response.data;
};

/**
 * Ищем доступные номера по фильтрам:
 * - checkIn, checkOut (ISO-строки формата yyyy-MM-ddTHH:mm:ssZ или yyyy-MM-dd)
 * - roomTypeId (опционально)
 * - guests (кол-во гостей, integer)
 */
export const fetchAvailableRooms = async (params: FetchAvailableParams): Promise<Room[]> => {
    const queryParams = new URLSearchParams();

    queryParams.append("checkIn", params.checkIn);
    queryParams.append("checkOut", params.checkOut);
    queryParams.append("guests", params.guests.toString());

    if (params.roomTypeId !== undefined) {
        queryParams.append("roomTypeId", params.roomTypeId.toString());
    }

    const response = await axios.get<Room[]>(
        `${API_URL}/available?${queryParams.toString()}`
    );
    return response.data;
};

/**
 * Создаёт новую комнату.
 * @param roomPayload — объект с полями, необходимыми для создания (omit id и status).
 *                      amenities и imageUrls — массивы строк.
 * @returns Promise<Room> — созданная комната с присвоенным id и status.
 */
export const createRoom = async (room: Room): Promise<Room> => {
    const response = await axios.post<Room>(API_URL, room, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
    });
    return response.data;
};


export const fetchAllRooms = async (): Promise<Room[]> => {
    const response = await axios.get<Room[]>(API_URL, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
    });
    return response.data;
};

export const updateRoom = async (room: Room): Promise<void> => {
    await axios.put(
        `${API_URL}/${room.id}`,
        room,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            },
        }
    );
};
