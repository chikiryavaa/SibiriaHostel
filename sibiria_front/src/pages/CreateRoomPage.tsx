// src/pages/CreateRoomPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchRoomTypes, createRoom } from '../api/rooms';
import type { RoomType } from '../api/rooms';
import type { Room } from '../types/room';

export default function CreateRoomPage() {
    const navigate = useNavigate();

    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [capacity, setCapacity] = useState<number>(1);
    const [roomTypeId, setRoomTypeId] = useState<number | ''>('');
    const [amenitiesText, setAmenitiesText] = useState<string>('');
    const [imageUrlsText, setImageUrlsText] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTypes = async () => {
            try {
                const types = await fetchRoomTypes();
                setRoomTypes(types);
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить типы номеров');
            }
        };
        loadTypes();
    }, []);

    // Преобразует textarea (по одной записи на строку) в массив строк
    const parseLines = (text: string): string[] =>
        text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!roomTypeId) {
            setError('Выберите тип номера.');
            return;
        }
        if (!title.trim() || price <= 0 || capacity <= 0) {
            setError('Заполните все обязательные поля корректными значениями.');
            return;
        }

        const payload: Room = {
            id: 0, // всегда 0 при создании
            roomTypeId: roomTypeId as number,
            title: title.trim(),
            description: description.trim(),
            price,
            capacity,
            amenities: parseLines(amenitiesText),
            imageUrls: parseLines(imageUrlsText),
            status: 'Available' // или 'InService', если комната пока неактивна
        };

        // 1) Выведем payload в консоль, чтобы убедиться, что там именно то, что нужно:
        console.log('→ Создаём комнату, payload =', JSON.stringify(payload, null, 2));

        try {
            await createRoom(payload);
            navigate('/admin/rooms');
        } catch (err: any) {
            // 2) Если ошибка, выведем детали из ответа сервера:
            console.error('Ошибка при createRoom:', err?.response?.data ?? err);
            setError('Не удалось создать номер. Проверьте введённые данные.');
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-12">
                <h1 className="text-3xl font-semibold text-center mb-8">
                    Добавить новый номер
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-xl mx-auto bg-white shadow rounded-lg p-6 space-y-6"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Тип номера *
                        </label>
                        <select
                            value={roomTypeId}
                            onChange={e =>
                                setRoomTypeId(
                                    e.target.value === '' ? '' : Number(e.target.value)
                                )
                            }
                            className="w-full border border-gray-300 rounded p-2"
                            required
                        >
                            <option value="">Выберите тип</option>
                            {roomTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Название *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            placeholder="Введите название"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Описание
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            rows={3}
                            placeholder="Краткое описание номера"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Цена за ночь, ₽ *
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={price}
                                onChange={e => setPrice(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded p-2"
                                placeholder="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Вместимость *
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={capacity}
                                onChange={e => setCapacity(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded p-2"
                                placeholder="1"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Удобства (по одному на строку)
                        </label>
                        <textarea
                            value={amenitiesText}
                            onChange={e => setAmenitiesText(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            rows={4}
                            placeholder="Например:&#10;Wi-Fi&#10;Кондиционер&#10;Телевизор"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL изображений (по одному на строку)
                        </label>
                        <textarea
                            value={imageUrlsText}
                            onChange={e => setImageUrlsText(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            rows={4}
                            placeholder="Например:&#10;https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="text-right">
                        <button
                            type="submit"
                            className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-2 rounded transition"
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
}
