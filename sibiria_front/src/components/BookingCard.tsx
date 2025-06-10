import type {Booking} from "../types/booking.ts";
import dayjs from "dayjs";

interface BookingCardProps {
    booking: Booking;
    isPast?: boolean;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, isPast = false }) => {
    // Форматируем дату в вид "12 Марта 2025"
    const checkInDate = dayjs(booking.checkIn).format('DD MMMM YYYY');
    const checkOutDate = dayjs(booking.checkOut).format('DD MMMM YYYY');

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Изображение */}
            <div className="h-40 w-full overflow-hidden">
                <img
                    src={booking.imageUrl}
                    alt={booking.roomName}
                    className="object-cover w-full h-full"
                />
            </div>
            {/* Содержимое карточки */}
            <div className="p-4 flex flex-col">
                <h3 className="text-lg font-medium text-gray-800 mb-2">{booking.roomName}</h3>
                <p className="text-gray-600 text-sm">Дата заезда: {checkInDate}</p>
                <p className="text-gray-600 text-sm ">Дата выезда: {checkOutDate}</p>
                <p className="text-gray-600 text-sm mb-4">Статус: {booking.status}</p>
                <p className="text-gray-600 text-sm mb-4">Общая стоимость: {booking.total}</p>

                {!isPast && (
                    <button
                        onClick={() => alert(`Перейти к деталям бронирования #${booking.id}`)}
                        className="mt-auto text-center px-4 py-2 border border-teal-400 text-teal-400 rounded hover:bg-teal-50 transition"
                    >
                        Узнать подробней
                    </button>
                )}
                {isPast && booking.comments && (
                    <p className="text-gray-500 text-sm mt-auto">Comments: {booking.comments}</p>
                )}
            </div>
        </div>
    );
};

export default BookingCard;