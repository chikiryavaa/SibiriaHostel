// src/pages/PaymentSuccess.tsx

import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentSuccess: React.FC = () => {
    const location = useLocation();
    const [bookingId, setBookingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Читаем bookingId из URL: /payment-success?bookingId=123
        const params = new URLSearchParams(location.search);
        const bId = params.get('bookingId');
        if (bId) {
            setBookingId(Number(bId));
        }
    }, [location.search]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
            <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Оплата прошла успешно!</h1>
            <p className="text-gray-600 mb-6">
                Спасибо за бронирование. Наш администратор свяжется с вами для окончательного подтверждения.
            </p>
            {bookingId && (
                <p className="text-gray-500 mb-4">
                    Номер вашего бронирования: <strong>#{bookingId}</strong>
                </p>
            )}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Link
                to="/"
                className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition"
            >
                На главную
            </Link>
        </div>
    );
};

export default PaymentSuccess;
