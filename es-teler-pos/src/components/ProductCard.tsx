import React from 'react';
import { Product } from '../data/types';
import { usePos } from '../context/PosContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { dispatch } = usePos();

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-footer">
          <span className="product-price">Rp {product.price.toLocaleString('id-ID')}</span>
          <button className="add-button" onClick={handleAddToCart}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
