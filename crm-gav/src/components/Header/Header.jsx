// Header.js
import React from 'react';
import './Header.css';

function Header() {
    return (
        <div className="header">
            <div className="logo">
                <span className="text-logo">
                    Гаврош
                </span>
            </div>
            <nav className="navigation">
                <ul>
                    <li><a href="/products" className="active">Список товаров</a></li>
                    <li><a href="/metrics">Метрики</a></li>
                </ul>
            </nav>
        </div>
    );
}

export default Header;