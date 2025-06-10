// src/types/bookingAdmin.ts

export interface ServiceDto {
    id: number;
    name: string;
    description: string;
    price: number;
}

export interface BookingAdminDto {
    id: number;
    // Если поле гостя хранится на бэке как строка (GuestFirstName, GuestLastName):
    guestFirstName: string;
    guestLastName: string;
    // contactType у нас на бэке хранится как enum, но возвращается строкой
    contactType: string;
    contactValue: string;

    roomId: number;
    roomName: string;

    checkIn: string;   // ISO-строка
    checkOut: string;  // ISO-строка

    totalPrice: number;
    status: string;

    services: ServiceDto[];
}
