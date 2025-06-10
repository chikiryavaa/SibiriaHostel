// src/pages/ProfilePage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/useAuthStore';
import type { Booking } from '../types/booking';
import { fetchPastBookings, fetchUpcomingBookings } from '../api/booking';
import BookingCard from "../components/BookingCard.tsx";

dayjs.locale('ru');

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { token, user, logout } = useAuthStore();
    const [initializing, setInitializing] = useState(true);

    const [upcoming, setUpcoming] = useState<Booking[]>([]);
    const [past, setPast] = useState<Booking[]>([]);
    const [loadingUpcoming, setLoadingUpcoming] = useState(false);
    const [loadingPast, setLoadingPast] = useState(false);
    const [errorUpcoming, setErrorUpcoming] = useState<string | null>(null);
    const [errorPast, setErrorPast] = useState<string | null>(null);

    // 2. Настроить axios и завершить инициализацию, когда token подтянется
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setInitializing(false);
    }, [token]);

    // 3. После завершения инициализации, если user нет, редирект на /login
    useEffect(() => {
        if (!initializing && !user) {
            navigate('/login');
        }
    }, [initializing, user, navigate]);

    // 4. Загрузка бронирований после того, как user определён
    useEffect(() => {
        if (!user) return;

        const loadUpcoming = async () => {
            setLoadingUpcoming(true);
            setErrorUpcoming(null);
            try {
                const data = await fetchUpcomingBookings();
                console.log(data);
                setUpcoming(data);
            } catch {
                setErrorUpcoming('Не удалось загрузить предстоящие бронирования');
            } finally {
                setLoadingUpcoming(false);
            }
        };

        const loadPast = async () => {
            setLoadingPast(true);
            setErrorPast(null);
            try {
                const data = await fetchPastBookings();
                console.log(data);
                setPast(data);
            } catch {
                setErrorPast('Не удалось загрузить прошлые бронирования');
            } finally {
                setLoadingPast(false);
            }
        };

        loadUpcoming();
        loadPast();
    }, [user]);

    if (initializing) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Загрузка профиля...</p>
            </div>
        );
    }


    // Если user не определён, нас уже редиректнуло, поэтому дальше user гарантирован.
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-6 py-12">
                {/* Заголовок профиля */}
                <h1 className="text-3xl font-semibold text-center mb-10">Ваш профиль</h1>

                {/* Блок с информацией о пользователе */}
                {user && (
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-12 ">
                        <p className="text-lg font-medium">{user.FullName}</p>
                        <p className="text-gray-600">{user.Email}</p>
                        <p className="text-gray-600">{user.Phone}</p>
                        {/*<button*/}
                        {/*    onClick={() => navigate('/profile/edit')}*/}
                        {/*    className="mt-4 w-full text-center px-4 py-2 border border-teal-400 text-teal-400 rounded hover:bg-teal-50 transition"*/}
                        {/*>*/}
                        {/*    Изменить данные*/}
                        {/*</button>*/}
                        <button
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="mt-4 w-full text-center px-4 py-2 border border-red-400 text-red-400 rounded hover:bg-red-50 transition"
                        >
                            Выйти
                        </button>
                    </div>
                )}

                {/* Предстоящие бронирования */}
                <section className="mb-16">
                    <h2 className="text-2xl font-semibold text-center mb-6">
                        Предстоящие бронирования
                    </h2>

                    {loadingUpcoming && (
                        <p className="text-center text-gray-500">Загрузка...</p>
                    )}
                    {errorUpcoming && (
                        <p className="text-center text-red-500">{errorUpcoming}</p>
                    )}
                    {!loadingUpcoming && !errorUpcoming && upcoming.length === 0 && (
                        <p className="text-center text-gray-500">
                            Нет предстоящих бронирований
                        </p>
                    )}
                    {!loadingUpcoming && !errorUpcoming && upcoming.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {upcoming.map((b) => (
                                <BookingCard key={b.id} booking={b} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Прошлые бронирования */}
                <section>
                    <h2 className="text-2xl font-semibold text-center mb-6">
                        Прошлые бронирования
                    </h2>

                    {loadingPast && (
                        <p className="text-center text-gray-500">Загрузка...</p>
                    )}
                    {errorPast && (
                        <p className="text-center text-red-500">{errorPast}</p>
                    )}
                    {!loadingPast && !errorPast && past.length === 0 && (
                        <p className="text-center text-gray-500">
                            Нет прошлых бронирований
                        </p>
                    )}
                    {!loadingPast && !errorPast && past.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {past.map((b) => (
                                <BookingCard key={b.id} booking={b} isPast />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;
