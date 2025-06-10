// src/pages/EditRoomPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {fetchRoomById, fetchRoomTypes, type RoomType, updateRoom} from '../api/rooms';
import type { Room } from '../types/room';

export default function EditRoomPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [roomData, setRoomData] = useState<Room | null>(null);
    const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [capacity, setCapacity] = useState<number>(1);
    const [roomTypeId, setRoomTypeId] = useState<number | ''>('');
    const [amenitiesText, setAmenitiesText] = useState<string>('');
    const [imageUrlsText, setImageUrlsText] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const load = async () => {
            if (!id) {
                setError('Неверный ID.');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const [room, types] = await Promise.all([
                    fetchRoomById(Number(id)),
                    fetchRoomTypes(),
                ]);

                setRoomData(room);
                setRoomTypes(types);

                setTitle(room.title);
                setDescription(room.description || '');
                setPrice(room.price);
                setCapacity(room.capacity);
                setRoomTypeId(room.roomTypeId);

                // Вместо JSON.parse(room.amenities) достаточно взять массив напрямую:
                const parsedAmenities = room.amenities;        // уже string[]
                setAmenitiesText(parsedAmenities.join('\n'));

                const parsedImages = room.imageUrls;          // уже string[]
                setImageUrlsText(parsedImages.join('\n'));
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить данные номера.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const parseLines = (text: string): string[] =>
        text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomData) return;

        if (!roomTypeId) {
            setError('Выберите тип номера.');
            return;
        }
        if (!title || !price || !capacity) {
            setError('Заполните все обязательные поля.');
            return;
        }

        const updated: Room = {
            ...roomData,
            title,
            description,
            price,
            capacity,
            roomTypeId: roomTypeId as number,
            amenities: parseLines(amenitiesText),
            imageUrls: parseLines(imageUrlsText),
            status: roomData.status // оставляем прежний статус
        };

        try {
            await updateRoom(updated);
            navigate('/admin/rooms');
        } catch (err) {
            console.error(err);
            setError('Не удалось сохранить изменения.');
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
            <div className="flex flex-col items-center justify-center h-screen px-4">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!roomData) return null;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-12">
                <h1 className="text-3xl font-semibold text-center mb-8">
                    Редактировать номер #{roomData.id}
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-lg shadow p-6 max-w-xl mx-auto space-y-4"
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
                        >
                            <option value="">Выберите тип</option>
                            {roomTypes.map((type) => (
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
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Цена за ночь (₽) *
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={price}
                                onChange={e => setPrice(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded p-2"
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
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

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
