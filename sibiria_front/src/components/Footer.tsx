// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 py-8">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                {/* Левый блок: логотип/название */}
                <div className="mb-4 md:mb-0">
                    <span className="text-white font-bold text-xl">Сибирь</span>
                </div>

                {/* Центр: копирайт */}
                <div className="text-center mb-4 md:mb-0">
                    © 2025 Brand, Inc. • Privacy • Terms • Sitemap
                </div>
                {/* Правый блок: соцсети */}
                <div className="flex space-x-4">
                    {/* Можно вставить svg-иконки Twitter, Facebook, LinkedIn, YouTube */}
                    <a href="#" aria-label="Twitter" className="hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {/* пример контура */}
                            <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 7v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                    </a>
                    {/* Другие иконки аналогично */}
                    <a href="#" aria-label="Facebook" className="hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.2 3-3.2.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0022 12z" />
                        </svg>
                    </a>
                    <a href="#" aria-label="LinkedIn" className="hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z" />
                        </svg>
                    </a>
                    <a href="#" aria-label="YouTube" className="hover:text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M19.6 3H4.4C2 3 0 5 0 7.4v9.2C0 19 2 21 4.4 21h15.2c2.4 0 4.4-2 4.4-4.4V7.4c0-2.4-2-4.4-4.4-4.4zm-9.6 14V7l6 5-6 5z" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Нижняя часть: выбор языка */}

        </footer>
    );
};

export default Footer;
