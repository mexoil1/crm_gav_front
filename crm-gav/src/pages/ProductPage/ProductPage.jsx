// ProductPage.js
import React, { useState, useEffect } from 'react';
import ProductItem from "../../components/ProductItem/ProductItem";
import Header from "../../components/Header/Header";
import './ProductPage.css'; // Импортируйте стили

function ProductPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 2000);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        const fetchProducts = async (query) => {
            try {
                let url = 'https://crmbimbimbambam.hopto.org/api/product-service/products/';
                if (query) {
                    url += `?name=${encodeURIComponent(query)}`;
                }

                const token = localStorage.getItem('access_token');

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных');
                }

                const data = await response.json();

                const transformedProducts = data.map(product => ({
                    ...product,
                    categoryName: product.category,
                    brandName: product.brand
                }));

                setProducts(transformedProducts);
            } catch (error) {
                console.error('Ошибка:', error.message);
            }
        };

        fetchProducts(debouncedQuery);
    }, [debouncedQuery]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className="container">
            <Header />
            <h3 className="title">Список товаров</h3>
            <div className="nav-menu">
                <form className="search-form">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search products..."
                        className="search-input"
                    />
                </form>
            </div>
            <div className="products-list">
                <table>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((product) => (
                        <ProductItem key={product.uid} product={product} />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProductPage;