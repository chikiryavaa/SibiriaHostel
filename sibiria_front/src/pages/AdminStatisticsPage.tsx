import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {Card} from "../components/CardStatistic";
import Header from "../components/Header.tsx";

interface AdminStatistic {
    id: number;
    date: string;
    occupancyRate: number;
    totalVisitors: number;
    performance: number;
    totalBookings: number;
    availableRooms: number;
    totalRevenue: number;
}

const formatMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('default', {month: 'short', year: 'numeric'});
};

const AdminStatisticsPage: React.FC = () => {
    const [statistics, setStatistics] = useState<AdminStatistic[]>([]);

    useEffect(() => {
        axios.get('https://localhost:7091/api/AdminStatistic')
            .then(res => {
                console.log('res.data:', res.data); // ← посмотри что тут
                setStatistics(res.data);
            })
            .catch(err => console.error(err));
    }, []);


    const chartData = statistics.map(s => ({
        ...s,
        month: formatMonth(s.date),
    }));

    return (
        <>
            <Header />
            <div className="p-6 space-y-6">

                <h1 className="text-2xl font-bold mb-4">Статистика администратора</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Уровень занятости" value="" subtitle="По месяцам">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="occupancyRate" stroke="#8884d8" name="Занятость (%)"/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card title="Общий доход" value="" subtitle="₽ за каждый месяц">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Bar dataKey="totalRevenue" fill="#82ca9d" name="Доход (₽)"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card title="Производительность" value="" subtitle="Эффективность за месяц">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="month"/>
                                <YAxis/>
                                <Tooltip/>
                                <Legend/>
                                <Line type="monotone" dataKey="performance" stroke="#ffc658"
                                      name="Производительность (%)"/>
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default AdminStatisticsPage;
