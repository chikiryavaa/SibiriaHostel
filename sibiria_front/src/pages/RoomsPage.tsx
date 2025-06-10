// src/pages/RoomsPage.tsx

import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RoomCard from "../components/RoomCard";
import type { Room } from "../types/room";
import {
  fetchRoomTypes,
  type RoomType,
  fetchAvailableRooms,
  type FetchAvailableParams,
} from "../api/rooms";

const RoomsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Фильтры
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");
  const [selectedType, setSelectedType] = useState<number | "">("");
  const [adults, setAdults] = useState<number>(1);
  const [children, setChildren] = useState<number>(0);
  const [guestDropdownVisible, setGuestDropdownVisible] = useState<boolean>(false);
  const guestRef = useRef<HTMLDivElement>(null);

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

  // Считываем query-параметры при загрузке или изменении URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const ci = params.get("checkIn") || "";
    const co = params.get("checkOut") || "";
    const rt = params.get("roomTypeId") || "";
    const ad = Number(params.get("adults") || "1");
    const ch = Number(params.get("children") || "0");

    setCheckIn(ci);
    setCheckOut(co);
    setSelectedType(rt === "" ? "" : Number(rt));
    setAdults(ad >= 1 ? ad : 1);
    setChildren(ch >= 0 ? ch : 0);
  }, [location.search]);

  // Загружаем список типов номеров
  useEffect(() => {
    const loadTypes = async () => {
      try {
        const types = await fetchRoomTypes();
        setRoomTypes(types);
      } catch {
        setError("Не удалось загрузить типы номеров");
      }
    };
    loadTypes();
  }, []);

  // Авто-поиск при изменении фильтров
  useEffect(() => {
    const doSearch = async () => {
      if (!checkIn || !checkOut) return;
      if (new Date(checkIn) >= new Date(checkOut)) {
        setError("Дата заезда должна быть раньше даты выезда.");
        return;
      }
      if (adults < 1) {
        setError("Количество взрослых должно быть минимум 1.");
        return;
      }
      if (children < 0) {
        setError("Количество детей не может быть отрицательным.");
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const totalGuests = adults + children;
        const params: FetchAvailableParams = {
          checkIn,
          checkOut,
          guests: totalGuests,
        };
        if (selectedType !== "") {
          params.roomTypeId = selectedType as number;
        }
        const rooms = await fetchAvailableRooms(params);
        setAvailableRooms(rooms);
      } catch {
        setError("Не удалось найти доступные номера.");
      } finally {
        setLoading(false);
      }
    };

    doSearch();
  }, [checkIn, checkOut, selectedType, adults, children]);

  // При ручной смене даты или типа — обновляем URL, чтобы сохранить параметры
  const updateQueryParams = () => {
    const params = new URLSearchParams();
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (selectedType !== "") params.append("roomTypeId", String(selectedType));
    params.append("adults", String(adults));
    params.append("children", String(children));
    navigate({ search: params.toString() });
  };

  // Обработчики для даты и типа — вызывают обновление парам
  const onCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckIn(e.target.value);
  };
  const onCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckOut(e.target.value);
  };
  const onTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value === "" ? "" : Number(e.target.value));
  };

  // При изменении гостей обновляем URL
  useEffect(() => {
    if (checkIn && checkOut) {
      updateQueryParams();
    }
  }, [adults, children, selectedType]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-center mb-8">Список номеров</h1>

        {/* Форма фильтрации */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Дата заезда */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата заезда
              </label>
              <input
                type="date"
                value={checkIn}
                min={"2025-06-02"}
                onChange={onCheckInChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            {/* Дата выезда */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата выезда
              </label>
              <input
                type="date"
                value={checkOut}
                min={"2025-06-02"}
                onChange={onCheckOutChange}
                className="w-full border border-gray-300 rounded p-2"
              />
            </div>

            {/* Тип номера */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тип номера
              </label>
              <select
                value={selectedType}
                onChange={onTypeChange}
                className="w-full border border-gray-300 rounded p-2"
              >
                <option value="">Все</option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Гости: dropdown */}
            <div ref={guestRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Гости
              </label>
              <button
                type="button"
                onClick={() => setGuestDropdownVisible((v) => !v)}
                className="w-full border border-gray-300 rounded p-2 bg-white text-left flex justify-between items-center"
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
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded mt-1 shadow-lg p-4 z-20">
                  <div className="flex items-center justify-between mb-3">
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
                  <div className="flex items-center justify-between mb-3">
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
                      className="px-4 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                    >
                      Готово
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Пустая колонка-заглушка для сетки (занимает 1 колонку) */}
            <div />
          </div>

          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        </div>

        {/* Список доступных комнат */}
        {loading ? (
          <div className="text-center text-gray-500">Загрузка...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {availableRooms.map((room) => {
              const query = new URLSearchParams({
                checkIn,
                checkOut,
                adults: String(adults),
                children: String(children),
              });
              if (selectedType !== "") {
                query.append("roomTypeId", String(selectedType));
              }
              return (
                <Link key={room.id} to={`/rooms/${room.id}?${query.toString()}`}>
                  <RoomCard room={room} />
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default RoomsPage;
