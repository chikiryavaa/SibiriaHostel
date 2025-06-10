export interface Booking {
    id: number;
    roomId: number;
    roomName: string;
    imageUrl: string;  // берём первый URL из массива imageUrls комнаты
    checkIn: string;       // ISO-строка
    checkOut: string;      // ISO-строка
    total: number;
    comments?: string;     // если есть комменты
    status:string;
}