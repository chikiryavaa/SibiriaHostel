// src/components/AdminRoomCard.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Room } from '../types/room';

interface AdminRoomCardProps {
    room: Room;
}

const AdminRoomCard: React.FC<AdminRoomCardProps> = ({ room }) => {
    const navigate = useNavigate();

    const handleEdit = () => {
        navigate(`/admin/rooms/${room.id}/edit`);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            {/* Изображение: пусть будет первая картинка или заглушка */}
            <div className="h-40 w-full bg-gray-200">
                {room.imageUrls && room.imageUrls.length > 0 ? (
                    <img
                        src={room.imageUrls[0]}
                        alt={room.title}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-500">
                        Нет фото
                    </div>
                )}
            </div>

            <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {room.title}
                </h3>
                <p className="text-gray-600 mb-1">
                    Цена: <span className="font-medium">{room.price.toLocaleString('ru-RU')} ₽</span>
                </p>
                <p className="text-gray-600 mb-1">
                    Вместимость: <span className="font-medium">{room.capacity}</span>
                </p>
                <p className="text-gray-600 mb-4">
                    Статус: <span className="font-medium">{room.status}</span>
                </p>

                <button
                    onClick={handleEdit}
                    className="mt-auto bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded transition"
                >
                    Изменить
                </button>
            </div>
        </div>
    );
};

export default AdminRoomCard;
