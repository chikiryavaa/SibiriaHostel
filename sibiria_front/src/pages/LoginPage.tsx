import  {type FormEvent, useEffect, useState} from "react";
import {loginUser, type LoginUserPayload} from "../api/userService.ts";
import axios from "axios";
import Header from "../components/Header.tsx";
import {useAuthStore} from "../store/useAuthStore";
import {useNavigate} from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();

    const setToken = useAuthStore((state) => state.setToken);
    // Если токен уже есть, можно сразу перенаправить
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            // Устанавливаем заголовок по умолчанию
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            console.log(token);
        }
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();


        const payload: LoginUserPayload = {
            email: email,
            password: password,
        };

        try {
            const response = await loginUser(payload);
            console.log("Response data:", response.data);
            const {token} = response.data;
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            setToken(token);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError("Неверный логин или пароль")

        }
    };
    return (
        <div className="max-h-screen bg-white overflow-hidden  ">
            <Header/>

            {/* Фоновое изображение под всей шириной экрана */}
            <div
                className="
          relative
          w-full
          bg-[url('/reg_back.jpg')]
          bg-cover
          bg-center
          bg-no-repeat
          min-h-screen
          flex
          justify-center
          items-center

        "
            >
                {/* Белый контейнер с формой */}
                <div className="bg-slate-50 h-screen min-w-2/5  flex justify-center  shadow-lg">
                    <div className="items-center min-w-2/3 ">
                        <h1 className={"text-5xl font-bold mt-52 items-center text-center"}>Авторизация</h1>
                        <form action="submit" className={"mt-32 w-full"} onSubmit={handleSubmit}>
                            <div>
                                <input type="text"
                                       placeholder={"Введите Email"}
                                       onChange={(e) => setEmail(e.target.value)}
                                       value={email}
                                       className={"w-full border border-gray-300 mb-3 rounded-md p-2"}/>
                            </div>
                            <div>
                                <input type="password"
                                       placeholder={"Введите пароль"}
                                       value={password}
                                       onChange={(e) => setPassword(e.target.value)}
                                       className={"w-full border border-gray-300 rounded-md p-2"}/>
                            </div>
                            <p className={"text-end text-teal-500   "}><a href="reset">Забыли пароль?</a></p>
                            <p className={"text-red-500"}>{error}</p>

                            <button className={"w-full bg-teal-400 p-2 rounded-sm mt-3 font-bold text-white"}>Войти
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
