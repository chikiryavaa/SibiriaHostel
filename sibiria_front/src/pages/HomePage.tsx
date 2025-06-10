// src/pages/Home.tsx

import React, { useEffect, useState, useRef, FormEvent } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RoomCard from "../components/RoomCard";
import { fetchFeaturedRooms, fetchRoomTypes, type RoomType } from "../api/rooms";
import type { Room } from "../types/room";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Состояния формы
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [selectedType, setSelectedType] = useState<number | "">("");
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [guestDropdownVisible, setGuestDropdownVisible] = useState<boolean>(false);
  const guestRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  // Закрытие dropdown при клике вне
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (guestRef.current && !guestRef.current.contains(e.target as Node)) {
        setGuestDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Загрузка featured rooms и типов номеров
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [featured, types] = await Promise.all([
          fetchFeaturedRooms(),
          fetchRoomTypes(),
        ]);
        setRooms(featured);
        setRoomTypes(types);
      } catch (err: any) {
        console.error(err);
        setError("Не удалось загрузить данные.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    const totalGuests = adults + children;
    params.append("guests", String(totalGuests));
    if (selectedType !== "") params.append("roomTypeId", String(selectedType));
    params.append("adults", String(adults));
    params.append("children", String(children));
    navigate(`/rooms?${params.toString()}`);
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <section
        className="relative bg-cover bg-center h-[80vh]"
        style={{ backgroundImage: `url('/images/123.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Отель «Сибирь»
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-6">
            Уютные номера в сердце Сибири с духом гостеприимства
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="bg-white bg-opacity-90 rounded-md p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-5xl"
          >
            {/* Дата заезда */}
            <div className="flex flex-col">
              <label htmlFor="checkIn" className="text-sm font-medium text-gray-700">
                Заезд
              </label>
              <input
                type="date"
                id="checkIn"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Дата выезда */}
            <div className="flex flex-col">
              <label htmlFor="checkOut" className="text-sm font-medium text-gray-700">
                Выезд
              </label>
              <input
                type="date"
                id="checkOut"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Тип номера */}
            <div className="flex flex-col">
              <label htmlFor="roomType" className="text-sm font-medium text-gray-700">
                Тип номера
              </label>
              <select
                id="roomType"
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Все</option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Гости (адаптивный) */}
            <div ref={guestRef} className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-700">Гости</label>
              <button
                type="button"
                onClick={() => setGuestDropdownVisible((v) => !v)}
                className="mt-1 flex items-center justify-between w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white text-left focus:ring-indigo-500 focus:border-indigo-500"
              >
                <span>
                  {adults} {adults === 1 ? "взрослый" : "взрослых"}
                  {children > 0 && `, ${children} ${children === 1 ? "ребенок" : "детей"}`}
                </span>
                <svg
                  className="h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.66a.75.75 0 01-1.1 0l-4.25-4.66a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {guestDropdownVisible && (
                <div className="absolute top-full mt-1w-full bg-white border border-gray-300 rounded-md shadow-lg z-20 p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-700">Взрослые</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setAdults((a) => Math.max(1, a - 1))}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                        disabled={adults <= 1}
                      >
                        −
                      </button>
                      <span className="w-6 text-center">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults((a) => a + 1)}
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-700">Дети</span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => setChildren((c) => Math.max(0, c - 1))}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                        disabled={children <= 0}
                      >
                        −
                      </button>
                      <span className="w-6 text-center">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren((c) => c + 1)}
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setGuestDropdownVisible(false)}
                      className="px-4 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                    >
                      Готово
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Кнопка Найти (на всю высоту формы) */}
            <div className="flex items-end md:col-span-1">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-md transition duration-200"
              >
                Найти
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* История и информация об отеле */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 space-y-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-semibold mb-4">Наша История</h2>
            <p className="text-gray-700 leading-relaxed">
              Отель «Сибирь» открыл свои двери в далеком 1925 году, когда
              путешественники из разных уголков страны искали уютный приют в
              снежных просторах Сибири. С тех пор мы тщательно храним дух
              исконного сибирского гостеприимства и стремимся предложить
              каждому гостю атмосферу тепла и уюта, даже когда за окном
              бушуют суровые морозы.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-3">Наследие и Традиции</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Стены нашего отеля помнят легенды и истории: от приездов знаменитых
                учёных и художников до долгих зимних вечеров у ночного костра.
                Мы внимательно сохраняем архитектурные особенности здания,
                сочетая старинные элементы с современным комфортом. Каждый гостевой
                номер украшен авторскими фотографиями 30-х годов, а коридоры
                хранят старинные экспонаты, рассказывающие о жизни в Сибири в
                начале XX века.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Мы гордимся тем, что ежегодно проводим «Фестиваль Сибирских Сказаний»,
                куда приезжают музыканты и поэты, чтобы поделиться творчеством и
                согреть сердца гостей. Добро пожаловать в место, где прошлое
                встречается с настоящим.
              </p>
            </div>
            <div>
              <img
                src="https://img.freepik.com/free-photo/sunny-urban-landscape_23-2149504786.jpg?semt=ais_hybrid&w=740"
                alt="Старинная фотография отеля"
                className="w-full rounded-lg shadow-lg object-cover h-64"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <img
                src="https://st4.depositphotos.com/1829243/38889/i/450/depositphotos_388890594-stock-photo-father-son-sitting-comfortable-armchairs.jpg"
                alt="Гости у камина"
                className="w-full rounded-lg shadow-lg object-cover h-64"
              />
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-semibold mb-3">Современный Уют</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Сегодня «Сибирь» — это идеальное сочетание традиций и современных
                удобств. Мы предлагаем просторные номера с панорамными окнами,
                откуда открывается вид на величественные сосновые леса. В каждом
                номере установлена система «умный дом», чтобы вы могли
                самостоятельно регулировать климат и освещение, не отрываясь от
                чашки горячего чая.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Насладитесь атмосферой каминного зала, где вечерами гости собираются
                за чашечкой ароматного кофе, обсуждая прошедший день. А наше
                спа-центра с натуральными саунами и банями восстановят силы после
                долгого пути.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Избранные комнаты (только 4) */}
      <section id="featured-rooms" className="container mx-auto px-4 py-16 flex-1">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Избранные комнаты
        </h2>

        {loading && (
          <div className="text-center text-gray-500">Загрузка...</div>
        )}
        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {rooms.slice(0, 4).map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </section>

      {/* Контактная информация */}
      <section id="contact-info" className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">
            Контактная информация
          </h2>
          <div className="max-w-2xl mx-auto text-center space-y-4 text-gray-700">
            <p>
              <span className="font-medium">Адрес:</span> Россия, г. Новосибирск,
              ул. Ленина, 10
            </p>
            <p>
              <span className="font-medium">Телефон:</span> +7 (383) 123-45-67
            </p>
            <p>
              <span className="font-medium">Email:</span> info@sibiria-hotel.ru
            </p>
            <p>
              <span className="font-medium">Часы работы ресепшн:</span> 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Футер */}
      <Footer />
    </div>
  );
};

export default Home;
