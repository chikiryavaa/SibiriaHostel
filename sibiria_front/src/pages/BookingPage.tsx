// src/pages/BookingPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchRoomById } from '../api/rooms';
import type { Room } from '../types/room';
import { fetchAllServices, type Service } from '../api/services';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore'; // чтобы взять токен

dayjs.locale('ru');

interface SelectedService {
    service: Service;
    selected: boolean;
}

const BookingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const { token } = useAuthStore();

    const [room, setRoom] = useState<Room | null>(null);
    const [checkIn, setCheckIn] = useState<string>('');
    const [checkOut, setCheckOut] = useState<string>('');
    const [guests, setGuests] = useState<number>(1);
    const [services, setServices] = useState<SelectedService[]>([]);
    const [totalPrice, setTotalPrice] = useState<number>(0);

    // *** Новые состояния ***
    const [guestFirstName, setGuestFirstName] = useState<string>('');
    const [guestLastName, setGuestLastName] = useState<string>('');
    const [contactType, setContactType] = useState<'Phone' | 'Email' | 'Telegram'>('Phone');
    const [contactValue, setContactValue] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Пришел ли через URL запрос с ?checkIn=…&checkOut=…&guests=…
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ci = params.get('checkIn') || '';
        const co = params.get('checkOut') || '';
        const g = Number(params.get('guests') || '1');

        setCheckIn(ci);
        setCheckOut(co);
        setGuests(g);
    }, [location.search]);

    // Загружаем данные комнаты и список всех доп. сервисов
    useEffect(() => {
        const loadData = async () => {
            if (!id) {
                setError('Неверный идентификатор номера');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Получаем данные о номере:
                const roomData = await fetchRoomById(Number(id));
                setRoom(roomData);

                // Получаем список всех сервисов:
                const all = await fetchAllServices();
                setServices(all.map((s) => ({ service: s, selected: false })));

                // Если даты валидны, посчитаем первоначальную сумму (без сервисов):
                if (ciValid(ci, co)) {
                    const nights = dayjs(co).diff(dayjs(ci), 'day');
                    setTotalPrice(nights * roomData.price);
                }
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить данные для бронирования');
            } finally {
                setLoading(false);
            }
        };

        const ci = checkIn;
        const co = checkOut;
        loadData();
    }, [id, checkIn, checkOut]);

    const ciValid = (ci: string, co: string) =>
        ci && co && dayjs(ci).isBefore(dayjs(co));

    // Пересчитываем итоговую цену при выборе/снятии галочек сервисов
    useEffect(() => {
        if (!room || !ciValid(checkIn, checkOut)) {
            setTotalPrice(0);
            return;
        }
        const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day');
        let sum = nights * room.price;
        services.forEach((item) => {
            if (item.selected) sum += item.service.price;
        });
        setTotalPrice(sum);
    }, [services, room, checkIn, checkOut]);

    const handleServiceToggle = (index: number) => {
        setServices((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const handlePayment = async () => {
        if (!room) {
            setError('Номер не загружен');
            return;
        }
        if (!ciValid(checkIn, checkOut)) {
            setError('Проверьте даты заезда и выезда');
            return;
        }
        if (!guestFirstName || !guestLastName || !contactValue) {
            setError('Пожалуйста, заполните имя, фамилию и данные для связи');
            return;
        }

        // Соберём список выбранных ID сервисов
        const selectedServiceIds = services
            .filter((item) => item.selected)
            .map((item) => item.service.id);

        // Мэппинг строкового contactType в число (enum)
        const enumMap: Record<'Phone' | 'Email' | 'Telegram', number> = {
            Phone: 0,
            Email: 1,
            Telegram: 2,
        };

        // Формируем DTO, соответствующий CreateBookingPaymentDto на бэке:
        const payload = {
            guestFirstName: guestFirstName.trim(),
            guestLastName: guestLastName.trim(),
            contactType: enumMap[contactType], // передаем число, а не строку
            contactValue: contactValue.trim(),
            roomId: room.id,
            checkIn: dayjs(checkIn).toISOString(),
            checkOut: dayjs(checkOut).toISOString(),
            serviceIds: selectedServiceIds,
            totalPrice: totalPrice,
            returnUrl: `${window.location.origin}/payment-success`
        };

        try {
            const response = await axios.post(
                'https://localhost:7091/api/Bookings/create-payment',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}` // если endpoint защищён JWT
                    }
                }
            );

            // Ожидаем { bookingId: number; paymentId: string; confirmationUrl: string; }
            const { bookingId, confirmationUrl } = response.data as {
                bookingId: number;
                paymentId: string;
                confirmationUrl: string;
            };

            // Редиректим пользователя на YooKassa:
            window.location.href = confirmationUrl;
        } catch (err: any) {
            console.error(err);
            setError(
                err.response?.data?.error ||
                'Ошибка при попытке перейти к оплате'
            );
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Загрузка...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-teal-400 text-white rounded hover:bg-teal-600 transition"
                >
                    Назад
                </button>
            </div>
        );
    }

    if (!room) return null;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-12">
                <h1 className="text-3xl font-semibold text-center mb-8">
                    Бронирование номера #{room.id}
                </h1>

                {/* Блок ввода даты/гостей/данных гостя */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">{room.title}</h2>
                    <p className="text-gray-700 mb-2">{room.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Дата заезда */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Дата заезда
                            </label>
                            <input
                                type="date"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>

                        {/* Дата выезда */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Дата выезда
                            </label>
                            <input
                                type="date"
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>

                        {/* Гости (хотя сейчас не используется на бэке) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Гостей
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>

                        {/* Имя гостя */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ваше имя
                            </label>
                            <input
                                type="text"
                                value={guestFirstName}
                                onChange={(e) => setGuestFirstName(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                                placeholder="Иван"
                            />
                        </div>

                        {/* Фамилия гостя */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ваша фамилия
                            </label>
                            <input
                                type="text"
                                value={guestLastName}
                                onChange={(e) => setGuestLastName(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                                placeholder="Иванов"
                            />
                        </div>

                        {/* Тип связи */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Тип связи
                            </label>
                            <select
                                value={contactType}
                                onChange={(e) =>
                                    setContactType(e.target.value as 'Phone' | 'Email' | 'Telegram')
                                }
                                className="w-full border border-gray-300 rounded p-2"
                            >
                                <option value="Phone">Телефон</option>
                                <option value="Email">Email</option>
                                <option value="Telegram">Telegram</option>
                            </select>
                        </div>

                        {/* Контактные данные */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Контактные данные
                            </label>
                            <input
                                type="text"
                                value={contactValue}
                                onChange={(e) => setContactValue(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                                placeholder="+7 999 123-45-67 или example@mail.ru"
                            />
                        </div>
                    </div>

                    <p className="text-lg font-medium mt-4">
                        Стоимость за ночь: {room.price.toLocaleString('ru-RU')} ₽
                    </p>
                </div>

                {/* Блок дополнительных услуг */}
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Дополнительные услуги</h2>
                    <ul className="space-y-4">
                        {services.map((item, i) => (
                            <li
                                key={item.service.id}
                                className="flex items-center justify-between"
                            >
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={item.selected}
                                        onChange={() => handleServiceToggle(i)}
                                        className="h-4 w-4"
                                    />
                                    <span>{item.service.name}</span>
                                </label>
                                <span className="text-gray-700">
                  {item.service.price.toLocaleString('ru-RU')} ₽
                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Итог и кнопка оплаты */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xl font-semibold">Итого:</span>
                        <span className="text-2xl font-bold">
              {totalPrice.toLocaleString('ru-RU')} ₽
            </span>
                    </div>
                    <button
                        onClick={handlePayment}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-3 rounded transition"
                    >
                        Оплатить и забронировать
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BookingPage;
