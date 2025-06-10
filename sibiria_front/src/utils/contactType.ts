// src/utils/contactType.ts
export function decodeContactType(raw: number | string): string {
    // Если raw приходит числом, парсим в число; иначе допускаем, что это строка с цифрой
    const value = typeof raw === 'number' ? raw : parseInt(raw, 10);
    switch (value) {
        case 0:
            return 'Телефон';
        case 1:
            return 'Email';
        case 2:
            return 'Telegram';
        default:
            return 'Неизвестно';
    }
}
