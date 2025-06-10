// src/pages/RoomDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {useAuthStore, } from "../store/useAuthStore";
import { fetchRoomById } from '../api/rooms';
import type { Room } from '../types/room';
import { HiOutlineWifi, HiOutlineFire, HiOutlineSparkles } from 'react-icons/hi';
import {
    FaBaby,
    FaDumbbell,
    FaSpa,
    FaSwimmingPool,
    FaParking,
    FaUtensils,
    FaSnowflake,
    FaShower,
} from 'react-icons/fa';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

interface AmenityIconMap {
    [key: string]: React.ReactNode;
}

const amenityIcons: AmenityIconMap = {
    'Wi-Fi': <HiOutlineWifi className="w-5 h-5 text-gray-600" />,
    'Железо': <HiOutlineSparkles className="w-5 h-5 text-gray-600" />,
    'Мини-бар': <HiOutlineFire className="w-5 h-5 text-gray-600" />,
    'Прачечная': <FaUtensils className="w-5 h-5 text-gray-600" />,
    'Кондиционер': <FaSnowflake className="w-5 h-5 text-gray-600" />,
    'Душ': <FaShower className="w-5 h-5 text-gray-600" />,
    'Кухня': <FaUtensils className="w-5 h-5 text-gray-600" />,
    'Бассейн': <FaSwimmingPool className="w-5 h-5 text-gray-600" />,
    'Спа': <FaSpa className="w-5 h-5 text-gray-600" />,
    'Спортзал': <FaDumbbell className="w-5 h-5 text-gray-600" />,
    'Парковка': <FaParking className="w-5 h-5 text-gray-600" />,
    'Детская кроватка': <FaBaby className="w-5 h-5 text-gray-600" />,
};

const RoomDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const {user} = useAuthStore();

    const [room, setRoom] = useState<Room | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Извлекаем из query: ?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD&guests=n
    const searchParams = new URLSearchParams(location.search);
    const checkInParam = searchParams.get('checkIn') || '';
    const checkOutParam = searchParams.get('checkOut') || '';
    const guestsParam = searchParams.get('guests') || '1';
    const guests = Number(guestsParam);

    useEffect(() => {
        const loadRoom = async () => {
            if (!id) {
                setError('Некорректный ID номера');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const data = await fetchRoomById(Number(id));
                setRoom(data);
            } catch {
                setError('Не удалось загрузить информацию о номере');
            } finally {
                setLoading(false);
            }
        };

        loadRoom();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Загрузка...</p>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-500 mb-4">{error ?? 'Номер не найден'}</p>
                <button
                    onClick={() => navigate('/rooms')}
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition-colors duration-200"
                >
                    Вернуться к списку
                </button>
            </div>
        );
    }

    const imagesToShow =
        room.imageUrls.length > 0 ? room.imageUrls : ['/images/placeholder.png'];

    // Проверка валидности дат
    const isDatesValid =
        checkInParam &&
        checkOutParam &&
        dayjs(checkInParam).isBefore(dayjs(checkOutParam));

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-12">
                <h1 className="text-3xl font-semibold text-center mb-8">
                    {room.title}
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {imagesToShow.map((src, idx) => (
                        <div
                            key={idx}
                            className="w-full h-48 overflow-hidden rounded-lg bg-gray-200"
                        >
                            <img
                                src={src}
                                alt={`${room.title} фото ${idx + 1}`}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ))}
                </div>

                <div className="text-center mb-8">
                    <p className="text-xl font-medium mb-2">
                        {room.price.toLocaleString('ru-RU')} ₽ / ночь
                    </p>

                    {isDatesValid ? (
                        <div className="text-gray-700 mb-4 space-y-1">
                            <p>
                                <span className="font-medium">Даты бронирования:</span>{' '}
                                {dayjs(checkInParam).format('DD MMMM YYYY')} –{' '}
                                {dayjs(checkOutParam).format('DD MMMM YYYY')}
                            </p>
                            <p>
                                <span className="font-medium">Гостей:</span> {guests}
                            </p>
                        </div>
                    ) : (
                        <p className="text-red-500 mb-4"></p>
                    )}

                    <button
                        className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-sm transition-colors duration-200 disabled:opacity-50"

                        onClick={() => {
                            navigate(
                                `/rooms/${room.id}/book?checkIn=${encodeURIComponent(
                                    checkInParam
                                )}&checkOut=${encodeURIComponent(
                                    checkOutParam
                                )}&guests=${guests}`
                            );
                        }}
                    >
                        Забронировать сейчас
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-semibold mb-4">Описание</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {room.description}
                        </p>
                    </div>

                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-semibold mb-4">Удобства</h2>
                        <ul className="space-y-4">
                            {room.amenities.map((amenity, idx) => (
                                <li key={idx} className="flex items-center">
                  <span className="mr-3">
                    {amenityIcons[amenity] ?? (
                        <span className="inline-block w-5 h-5 bg-gray-300 rounded-full" />
                    )}
                  </span>
                                    <span className="text-gray-700">{amenity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RoomDetailPage;
