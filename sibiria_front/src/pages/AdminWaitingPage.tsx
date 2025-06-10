// src/pages/AdminWaitingPage.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import type { BookingAdminDto } from '../types/bookingAdmin';
import { decodeContactType } from '../utils/contactType';

const API_BASE = 'https://localhost:7091/api/Bookings';

const AdminWaitingPage: React.FC = () => {
    const [bookings, setBookings] = useState<BookingAdminDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadWaiting = async () => {
            try {
                const res = await axios.get<BookingAdminDto[]>(`${API_BASE}/waiting-confirmation`);
                if (!Array.isArray(res.data)) {
                    setError('Неправильный формат ответа от сервера');
                    return;
                }
                setBookings(res.data);
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить бронирования для подтверждения');
            }
        };
        loadWaiting();
    }, []);

    const handleStatusChange = async (bookingId: number, newStatus: 'Confirmed' | 'Cancelled') => {
        try {
            await axios.patch(
                `${API_BASE}/${bookingId}/status`,
                JSON.stringify(newStatus),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            setBookings((prev) => prev.filter((b) => b.id !== bookingId));
        } catch (err) {
            console.error(err);
            alert('Ошибка при изменении статуса');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-12">
                <h1 className="text-3xl font-semibold text-center mb-8">
                    Бронирования, ожидающие подтверждения
                </h1>

                {error && <p className="text-center text-red-500 mb-4">{error}</p>}

                {!error && bookings.length === 0 && (
                    <p className="text-center text-gray-500">Нет бронирований для подтверждения</p>
                )}

                {bookings.length > 0 && (
                    <div className="space-y-8">
                        {bookings.map((b) => (
                            <div
                                key={b.id}
                                className="bg-white rounded-lg shadow p-6 border border-gray-200"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p>
                                            <span className="font-medium">Гость:</span>{' '}
                                            {b.guestFirstName} {b.guestLastName}
                                        </p>
                                        <p>
                                            <span className="font-medium">Контакт:</span>{' '}
                                            {decodeContactType(b.contactType)}: {b.contactValue}
                                        </p>
                                        <p>
                                            <span className="font-medium">Номер:</span>{' '}
                                            {b.roomName} (ID {b.roomId})
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            <span className="font-medium">Заезд:</span>{' '}
                                            {new Date(b.checkIn).toLocaleDateString('ru-RU')}
                                        </p>
                                        <p>
                                            <span className="font-medium">Выезд:</span>{' '}
                                            {new Date(b.checkOut).toLocaleDateString('ru-RU')}
                                        </p>
                                        <p>
                                            <span className="font-medium">Итого:</span>{' '}
                                            {b.totalPrice.toLocaleString('ru-RU')} ₽
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <span className="font-medium">Услуги:</span>{' '}
                                    {b.services.length > 0
                                        ? b.services.map((s) => s.name).join(', ')
                                        : 'Нет'}
                                </div>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => handleStatusChange(b.id, 'Confirmed')}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                    >
                                        Подтвердить
                                    </button>
                                    <button
                                        onClick={() => handleStatusChange(b.id, 'Cancelled')}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                    >
                                        Отменить
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default AdminWaitingPage;
