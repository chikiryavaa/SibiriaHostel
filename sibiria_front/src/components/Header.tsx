// src/components/Header.tsx

import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import clsx from 'clsx';
import { FaSignOutAlt } from 'react-icons/fa';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, token, logout } = useAuthStore();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Закрываем мобильное меню при клике вне
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Признак «админ вошёл в систему»
    const isAdmin = Boolean(token && user?.Role === 'Admin');

    // Функция для подсветки активного маршрута
    const isActive = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="w-full bg-white shadow-sm">
            <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
                {/* Логотип / название */}
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <div className="w-8 h-8 rounded-full bg-teal-400 flex items-center justify-center mr-2" />
                    <span className="text-2xl font-semibold">Сибирь</span>
                </div>

                {/* Десктоп-меню */}
                <nav className="hidden md:flex space-x-6 items-center">
                    {isAdmin ? (
                        // === Админ видит свои пункты + кнопку «Выйти» ===
                        <>
                            <Link
                                to="/admin/statistics"
                                className={clsx(
                                    'text-gray-700 hover:text-teal-600 transition-colors',
                                    isActive('/admin/statistics') && 'text-teal-600 font-medium'
                                )}
                            >
                                Статистика
                            </Link>
                            <Link
                                to="/admin/bookings"
                                className={clsx(
                                    'text-gray-700 hover:text-teal-600 transition-colors',
                                    isActive('/admin/bookings') && 'text-teal-600 font-medium'
                                )}
                            >
                                Бронирования
                            </Link>
                            <Link
                                to="/admin/rooms"
                                className={clsx(
                                    'text-gray-700 hover:text-teal-600 transition-colors',
                                    isActive('/admin/rooms') && 'text-teal-600 font-medium'
                                )}
                            >
                                Номера
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="ml-4 flex items-center text-red-500 hover:text-red-600 transition-colors"
                            >
                                <FaSignOutAlt className="mr-1" /> Выйти
                            </button>
                        </>
                    ) : (
                        // === Обычный посетитель видит только «Главная» и «Номера» ===
                        <>
                            <Link
                                to="/"
                                className={clsx(
                                    'text-gray-700 hover:text-teal-600 transition-colors',
                                    isActive('/') && 'text-teal-600 font-medium'
                                )}
                            >
                                Главная
                            </Link>
                            <Link
                                to="/rooms"
                                className={clsx(
                                    'text-gray-700 hover:text-teal-600 transition-colors',
                                    isActive('/rooms') && 'text-teal-600 font-medium'
                                )}
                            >
                                Номера
                            </Link>
                        </>
                    )}
                </nav>

                {/* Кнопка-бургер для мобильного меню */}
                <div className="md:hidden relative" ref={menuRef}>
                    <button
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400"
                    >
                        <svg
                            className="h-6 w-6 text-gray-700"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>

                    {mobileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
                            <nav className="flex flex-col p-2 space-y-1">
                                {isAdmin ? (
                                    // === Мобильное меню для админа ===
                                    <>
                                        <Link
                                            to="/admin/statistics"
                                            className={clsx(
                                                'block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded',
                                                isActive('/admin/statistics') && 'bg-gray-100'
                                            )}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Статистика
                                        </Link>
                                        <Link
                                            to="/admin/bookings"
                                            className={clsx(
                                                'block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded',
                                                isActive('/admin/bookings') && 'bg-gray-100'
                                            )}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Бронирования
                                        </Link>
                                        <Link
                                            to="/admin/rooms"
                                            className={clsx(
                                                'block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded',
                                                isActive('/admin/rooms') && 'bg-gray-100'
                                            )}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Номера
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="mt-2 w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 rounded"
                                        >
                                            <FaSignOutAlt className="inline-block mr-1" /> Выйти
                                        </button>
                                    </>
                                ) : (
                                    // === Мобильное меню для обычного посетителя ===
                                    <>
                                        <Link
                                            to="/"
                                            className={clsx(
                                                'block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded',
                                                isActive('/') && 'bg-gray-100'
                                            )}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Главная
                                        </Link>
                                        <Link
                                            to="/rooms"
                                            className={clsx(
                                                'block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded',
                                                isActive('/rooms') && 'bg-gray-100'
                                            )}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Номера
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
