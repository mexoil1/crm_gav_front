import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
} from 'chart.js';
import Header from "../../components/Header/Header";
import './MetricPage.css'; // Импортируйте стили

// Регистрация компонентов Chart.js
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
);

function MetricPage() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });
    const [productArticle, setProductArticle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!productArticle) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(`https://crmbimbimbambam.hopto.org/api/product-service/history-products/?product_article=${encodeURIComponent(productArticle)}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных');
                }
                const data = await response.json();

                const timestamps = data.map(item => new Date(item.created).toLocaleDateString());
                const boughtCounts = data.map(item => item.day_boughted);
                const watchedCounts = data.map(item => item.day_watched);

                setChartData({
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Количество купленных продуктов',
                            data: boughtCounts,
                            fill: false,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Цвет фона для линий
                            tension: 0.1
                        },
                        {
                            label: 'Количество просмотренных продуктов',
                            data: watchedCounts,
                            fill: false,
                            borderColor: 'rgba(153, 102, 255, 1)',
                            backgroundColor: 'rgba(153, 102, 255, 0.2)', // Цвет фона для линий
                            tension: 0.1
                        }
                    ]
                });
            } catch (error) {
                console.error('Ошибка:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [productArticle]);

    const handleChange = (event) => {
        setProductArticle(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (productArticle) {
            setChartData({ labels: [], datasets: [] }); // Сброс данных перед новым запросом
        }
    };

    return (
        <div className="container">
            <Header />
            <h3>Метрики продаж</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Артикул продукта:
                    <input
                        type="text"
                        value={productArticle}
                        onChange={handleChange}
                        placeholder="Введите артикул продукта"
                        required
                    />
                </label>
            </form>
            {isLoading ? <p>Загрузка...</p> : (
                <div className="chart-container">
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
}

export default MetricPage;