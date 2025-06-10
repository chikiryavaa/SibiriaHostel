import React from 'react';
import type {Room} from '../types/room';
import {useNavigate} from "react-router-dom";

interface RoomCardProps {
    room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({room}) => {
    // Если массив imageUrls пуст, можно подставить какую-то заглушку:
    const imageSrc = room.imageUrls && room.imageUrls.length > 0
        ? room.imageUrls[0]
        : '/images/placeholder.png'; // положите в public/images/placeholder.png

    const navigate = useNavigate();

    return (
        <div
            className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
            {/* Изображение */}
            <div className="h-48 w-full relative">
                <img
                    src={imageSrc}
                    alt={room.title}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Контент карточки */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{room.title}</h3>
                <div className={"flex justify-between"}>
                    <p className="text-indigo-600 font-bold">
                        {room.price.toLocaleString('ru-RU')} ₽ / Ночь
                    </p>
                    <p>
                        Вместимость: {room.capacity} человека
                    </p>
                </div>

                {/* Здесь можно при желании вывести список удобств (amenities) */}
                {room.amenities && room.amenities.length > 0 && (
                    <ul className="mt-3 text-sm text-gray-600 space-y-1">
                        {room.amenities.map((item, idx) => (
                            <li key={idx} className="inline-block mr-2 bg-gray-100 px-2 py-1 rounded-full">
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
                {/* Кнопка «Узнать подробней» */}
                <button
                    className="mt-4 py-2 px-3 border border-indigo-500 text-indigo-500 rounded-md hover:bg-indigo-500 hover:text-white transition-colors duration-200 text-sm font-medium"
                    onClick={() => navigate(`/rooms/${room.id}`)}
                >
                    Узнать подробней
                </button>

            </div>
        </div>
    );
};

export default RoomCard;