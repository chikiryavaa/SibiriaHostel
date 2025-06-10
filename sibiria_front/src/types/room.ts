export interface Room {
    id: number;
    roomTypeId: number;
    title: string;
    description: string;
    price: number;            // decimal(10,2) на бекенде
    capacity: number;
    status: string;           // строковое представление enums RoomStatus
    amenities: string[];      // раньше было string, теперь – массив
    imageUrls: string[];      // тоже массив
}
