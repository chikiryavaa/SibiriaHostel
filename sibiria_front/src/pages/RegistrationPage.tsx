// src/components/Registration.tsx
import {type FC, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, type CreateUserPayload } from "../api/userService";
import Header from "../components/Header.tsx";

const Registration: FC = () => {
    const navigate = useNavigate();

    // Состояние для полей формы
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const userPayload: CreateUserPayload = {
            id: 0,
            fullName: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            role: "user",
            password: password,
        };

        try {
            await registerUser(userPayload);
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError("Не удалось зарегистрироваться. Проверьте данные и попробуйте снова.");
        }
    };

    return (
        <div className="min-h-screen bg-white">
           <Header/>

            {/* Main content */}
            <div className="flex justify-center items-start mt-10">
                <div className="w-full max-w-5xl bg-white">
                    <div className="flex flex-col items-center py-12 px-8">
                        <h1 className="text-3xl font-bold mb-8">Регистрация</h1>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form className="w-full max-w-md space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Пароль
                                </label>
                                <input
                                    type="password"
                                    placeholder="********"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Имя
                                </label>
                                <input
                                    type="text"
                                    placeholder="Иван"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Фамилия
                                </label>
                                <input
                                    type="text"
                                    placeholder="Иванов"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Номер телефона
                                </label>
                                <input
                                    type="tel"
                                    placeholder="(123) 234 22-33"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-teal-400 text-white py-3 rounded text-lg font-medium hover:bg-teal-500"
                            >
                                Зарегистрироваться
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Registration;
