import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProductEdit.css';
import Header from "../../components/Header/Header"; // Импортируйте стили

function ProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        uid: '',
        title: '',
        category: '',
        brand: '',
        price: '',
        main_image: '',
        color: '',
        article: '',
        is_available: true
    });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(`https://crmbimbimbambam.hopto.org/api/product-service/products/${id}/`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке данных продукта');
                }
                const data = await response.json();
                setProduct({
                    uid: data.uid,
                    title: data.name,
                    category: data.category,
                    brand: data.brand,
                    price: data.price,
                    main_image: data.main_image,
                    color: data.color,
                    article: data.article,
                    is_available: data.is_available
                });
                setImagePreview(data.main_image);
            } catch (error) {
                console.error('Ошибка:', error.message);
            }
        };

        const fetchCategoriesAndBrands = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const [categoriesResponse, brandsResponse] = await Promise.all([
                    fetch('https://crmbimbimbambam.hopto.org/api/product-service/categories/', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }),
                    fetch('https://crmbimbimbambam.hopto.org/api/product-service/brands/', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                ]);
                if (!categoriesResponse.ok || !brandsResponse.ok) {
                    throw new Error('Ошибка при загрузке данных категорий или брендов');
                }
                const categoriesData = await categoriesResponse.json();
                const brandsData = await brandsResponse.json();
                setCategories(categoriesData);
                setBrands(brandsData);
            } catch (error) {
                console.error('Ошибка:', error.message);
            }
        };

        fetchProduct();
        fetchCategoriesAndBrands();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct({ ...product, [name]: value });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProduct({ ...product, main_image: file });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const formData = new FormData();
            formData.append('name', product.title);
            formData.append('category', product.category);
            formData.append('brand', product.brand);
            formData.append('price', product.price);
            formData.append('color', product.color);
            formData.append('article', product.article);
            formData.append('is_available', product.is_available);

            if (product.main_image) {
                formData.append('main_image', product.main_image);
            }

            const response = await fetch(`https://crmbimbimbambam.hopto.org/api/product-service/products/${id}/`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Ошибка при сохранении данных продукта');
            }
            navigate('/products');
        } catch (error) {
            console.error('Ошибка:', error.message);
        }
    };

    const handleCancel = () => {
        navigate('/products');
    };

    const handleDelete = async () => {
        if (window.confirm('Вы точно хотите безвозвратно удалить этот товар?')) {
            try {
                const token = localStorage.getItem('access_token');
                const response = await fetch(`https://crmbimbimbambam.hopto.org/api/product-service/products/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Ошибка при удалении продукта');
                }
                navigate('/products');
            } catch (error) {
                console.error('Ошибка:', error.message);
            }
        } else {
            navigate(`/products/${id}`);
        }
    };

    return (
        <div className="container">
            <Header />
            <h3>Редактирование товара</h3>
            <form>
                <label>
                    Title:
                    <input
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Category:
                    <input
                        type="text"
                        name="category"
                        value={product.category}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Brand:
                    <input
                        type="text"
                        name="brand"
                        value={product.brand}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Price:
                    <input
                        type="text"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Color:
                    <input
                        type="text"
                        name="color"
                        value={product.color}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Article:
                    <input
                        type="text"
                        name="article"
                        value={product.article}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Availability:
                    <input
                        type="checkbox"
                        name="is_available"
                        checked={product.is_available}
                        onChange={(e) => setProduct({ ...product, is_available: e.target.checked })}
                    />
                </label>
                <label>
                    Изображение:
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
                {imagePreview && (
                    <div>
                        <img src={imagePreview} alt="Product" style={{ maxWidth: '200px', marginTop: '10px' }} />
                    </div>
                )}
                <button type="button" onClick={handleSave}>Сохранить</button>
                <button type="button" onClick={handleCancel}>Назад</button>
                <button type="button" onClick={handleDelete}>Удалить товар</button>
            </form>
        </div>
    );
}

export default ProductEdit;