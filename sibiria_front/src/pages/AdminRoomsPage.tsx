// src/pages/AdminRoomsPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { fetchAllRooms } from '../api/rooms';
import type { Room } from '../types/room';
import AdminRoomCard from '../components/AdminRoomCard';

const AdminRoomsPage: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadRooms = async () => {
            try {
                setLoading(true);
                const data = await fetchAllRooms();
                setRooms(data);
            } catch (err) {
                console.error(err);
                setError('Не удалось загрузить список номеров');
            } finally {
                setLoading(false);
            }
        };

        loadRooms();
    }, []);

    const handleAdd = () => {
        navigate('/admin/rooms/create');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Загрузка номеров...</p>
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

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-semibold">Управление номерами</h1>
                    <button
                        onClick={handleAdd}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded transition"
                    >
                        Добавить номер
                    </button>
                </div>

                {rooms.length === 0 ? (
                    <p className="text-center text-gray-600">Нет ни одного номера.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {rooms.map((room) => (
                            <AdminRoomCard key={room.id} room={room} />
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default AdminRoomsPage;
