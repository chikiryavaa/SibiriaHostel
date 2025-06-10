import React, {useEffect} from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Registration from "./pages/RegistrationPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import RoomsPage from "./pages/RoomsPage.tsx";
import RoomDetailPage from "./pages/RoomDetailPage.tsx";
import {useAuthStore} from "./store/useAuthStore.ts";
import ProfilePage from "./pages/ProfilePage.tsx";
import BookingPage from "./pages/BookingPage.tsx";
import PaymentSuccess from "./pages/PaymentSuccessPage.tsx";
import AdminWaitingPage from "./pages/AdminWaitingPage.tsx";
import AdminRoomsPage from "./pages/AdminRoomsPage.tsx";
import EditRoomPage from "./pages/EditRoomPage.tsx";
import CreateRoomPage from "./pages/CreateRoomPage.tsx";
import AdminStatisticsPage from "./pages/AdminStatisticsPage.tsx";
import PasswordResetPage from './pages/PasswordResetPage.tsx';


function App() {
    const {restoreFromLocalStorage } = useAuthStore();

    useEffect(() => {
        // Воскрешаем состояние из localStorage при старте приложения
        restoreFromLocalStorage();
    }, [restoreFromLocalStorage]);
    return (
        <Router>
            <Routes>
                <Route path="/registration" element={<Registration />} />
                <Route path="/login" element={<LoginPage />} />
                <Route index element={<HomePage />} />
                <Route path={"/rooms"} element={<RoomsPage />} />
                <Route path="/rooms/:id" element={<RoomDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/reset" element={<PasswordResetPage />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/rooms/:id/book" element={<BookingPage />} />
                <Route path="/admin/bookings" element={<AdminWaitingPage />} />
                <Route path="/admin/rooms" element={<AdminRoomsPage />} />
                <Route path="/admin/rooms/:id/edit" element={<EditRoomPage />} />
                <Route path="/admin/rooms/:id/edit" element={<EditRoomPage />} />
                <Route path="/admin/rooms/create" element={<CreateRoomPage />} />
                <Route path="/admin/statistics" element={<AdminStatisticsPage />} />

            </Routes>
        </Router>
    );
}

export default App
