// src/api/bookings.ts

import axios from 'axios';
import type {Booking} from "../types/booking.ts";

const API_URL = 'https://localhost:7091/api/Bookings';

// Структура Booking (пример, будет описана в types/booking.ts):
// {
//   id: number;
//   roomId: number;
//   roomName: string;
//   roomImageUrl: string;
//   checkIn: string;   // ISO-строка, например "2025-03-12T14:00:00Z"
//   checkOut: string;  // ISO-строка
//   comments?: string; // необязательно
// }

export interface CreateBookingPaymentResponse {
    bookingId: number;
    confirmationUrl: string;
}

// Получить предстоящие бронирования текущего пользователя
export const fetchUpcomingBookings = async (): Promise<Booking[]> => {
    const resp = await axios.get<Booking[]>(`${API_URL}/upcoming`);
    return resp.data;
};

// Получить прошлые (завершённые) бронирования
export const fetchPastBookings = async (): Promise<Booking[]> => {
    const resp = await axios.get<Booking[]>(`${API_URL}/past`);
    return resp.data;
};

export const createBookingPayment = async (payload: {
    roomId: number;
    checkIn: string;    // формата YYYY-MM-DD
    checkOut: string;   // формата YYYY-MM-DD
    totalPrice: number; // сумма
    returnUrl: string;  // например: "https://localhost:3000/payment-success"
}): Promise<CreateBookingPaymentResponse> => {
    const res = await axios.post<CreateBookingPaymentResponse>(
        'https://localhost:7091/api/bookings/create-payment',
        payload,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
        }
    );
    return res.data;
};
