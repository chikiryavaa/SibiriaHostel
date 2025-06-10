// src/api/bookingAdmin.ts

import axios from 'axios';
import type { BookingAdmin } from '../types/bookingAdmin';

const BASE_URL = 'https://localhost:7091/api/bookings';

export const fetchWaitingConfirmation = async (): Promise<BookingAdmin[]> => {
    // Предполагается, что на бэке есть контроллер:
    // [HttpGet("waiting-confirmation")]
    // public async Task<IActionResult> GetWaitingConfirmation() { … }
    const res = await axios.get<BookingAdmin[]>(`${BASE_URL}/waiting-confirmation`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
    });
    return res.data;
};

export const updateBookingStatus = async (
    bookingId: number,
    status: 'Confirmed' | 'Cancelled'
): Promise<void> => {
    await axios.patch(
        `${BASE_URL}/${bookingId}/status`,
        status,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            },
        }
    );
};
