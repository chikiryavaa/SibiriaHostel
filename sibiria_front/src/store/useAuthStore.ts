// src/store/useAuthStore.ts

import { create } from 'zustand';
import {jwtDecode} from 'jwt-decode';

interface User {
    id: number;
    FullName: string;
    Email: string;
    Role: string;
    Phone: string;
}

interface AuthStore {
    token: string | null;
    user: User | null;
    setToken: (token: string) => void;
    logout: () => void;
    restoreFromLocalStorage: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    token: null,
    user: null,

    setToken: (token) => {
        // Декодируем токен и ищем нужные URI-клады
        const decoded: any = jwtDecode(token);
        // Попробуем несколько вариантов: либо уже есть упрощённые ключи, либо full URI
        const idStr =
            decoded.NameIdentifier ||
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
        const fullName =
            decoded.Name ||
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        const email =
            decoded.Email ||
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
        const role =
            decoded.Role ||
            decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const phone =
            decoded.Phone ||
            decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'];

        if (!idStr || !fullName || !email) {
            // Если хоть что-то не нашли — считаем, что JWT некорректен
            console.warn('JWT не содержит ожидаемых полей');
            return;
        }

        const user: User = {
            id: parseInt(idStr, 10),
            FullName: fullName,
            Email: email,
            Role: role || '',
            Phone: phone || '',
        };

        localStorage.setItem('jwtToken', token);

        set({ token, user });
    },

    logout: () => {
        localStorage.removeItem('jwtToken');
        set({ token: null, user: null });
    },

    restoreFromLocalStorage: () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return;

        try {
            const decoded: any = jwtDecode(token);
            const exp =
                decoded.exp || decoded['exp']; // либо простое exp, либо string
            if (exp * 1000 < Date.now()) {
                // Токен просрочен
                localStorage.removeItem('jwtToken');
                return;
            }

            const idStr =
                decoded.NameIdentifier ||
                decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
            const fullName =
                decoded.Name ||
                decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
            const email =
                decoded.Email ||
                decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
            const role =
                decoded.Role ||
                decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            const phone =
                decoded.Phone ||
                decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/mobilephone'];

            if (!idStr || !fullName || !email) {
                console.warn('JWT не содержит ожидаемых полей при восстановлении');
                localStorage.removeItem('jwtToken');
                return;
            }

            const user: User = {
                id: parseInt(idStr, 10),
                FullName: fullName,
                Email: email,
                Role: role || '',
                Phone: phone || '',
            };

            set({ token, user });
        } catch {
            localStorage.removeItem('jwtToken');
        }
    },
}));
