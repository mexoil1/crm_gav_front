import React from 'react';
import { Link } from 'react-router-dom';

function ProductItem({ product }) {
    return (
        <tr className="product-item">
            <td className="product-title">
                <Link to={`/products/${product.uid}`}>{product.name}</Link>
            </td>
            <td className="product-info">{product.categoryName}</td>
            <td className="product-info">{product.brandName}</td>
            <td className="product-info">{product.price}</td>
        </tr>
    );
}

export default ProductItem;