import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = () => {
  const initialProducts = [
    { id: 1, name: 'T-shirt', category: 'Clothes', price: 20, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Jeans', category: 'Clothes', price: 40, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Jacket', category: 'Clothes', price: 60, image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Sneakers', category: 'Shoes', price: 50, image: 'https://via.placeholder.com/150' },
    { id: 5, name: 'Socks', category: 'Accessories', price: 5, image: 'https://via.placeholder.com/150' },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('price');

  const handleProductEdit = (id, field, value) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? { ...product, [field]: value } : product
    );
    setProducts(updatedProducts);
  };

  // Sorting products by price
  const sortedProducts = [...products].sort((a, b) => a.price - b.price);

  const filteredProducts = sortedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="row mt-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="col-md-4 mb-4" key={product.id}>
              <div className="card" style={{ width: '18rem' }}>
                <img src={product.image} className="card-img-top" alt={product.name} />
                <div className="card-body">
                  <h5 className="card-title">
                    <input
                      type="text"
                      value={product.name}
                      className="form-control"
                      onChange={(e) => handleProductEdit(product.id, 'name', e.target.value)}
                    />
                  </h5>
                  <p className="card-text">
                    Category: {product.category}
                  </p>
                  <p className="card-text">
                    Price: $
                    <input
                      type="number"
                      value={product.price}
                      className="form-control"
                      onChange={(e) => handleProductEdit(product.id, 'price', e.target.value)}
                    />
                  </p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Product ID: {product.id}</li>
                </ul>
                <div className="card-body">
                  <a href="#" className="card-link">View Details</a>
                  <a href="#" className="card-link">Add to Cart</a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
