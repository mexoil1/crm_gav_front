import React, { useState } from 'react';
import './LoginPage.css'; // Импорт стилей

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('https://crmbimbimbambam.hopto.org/api/user/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Ошибка при авторизации: ' + response.statusText);
            }

            const data = await response.json();
            const { access, refresh } = data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            console.log('Токены успешно сохранены');

            // Редирект на страницу /products после успешной авторизации
            window.location.href = '/products';
        } catch (error) {
            console.error('Ошибка:', error.message);
        }
    };

    return (
        <div className="login-container">
            <h3>Вход</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Электронная почта:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Войти</button>
            </form>
        </div>
    );
}

export default LoginPage;