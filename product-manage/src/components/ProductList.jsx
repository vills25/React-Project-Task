import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Container, Row, Col, Form, ListGroup, Pagination } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductList = () => {
  const initialProducts = [
    { id: 1, name: 'T-shirt', category: 'Clothes', price: 20 },
    { id: 2, name: 'Jeans', category: 'Clothes', price: 40 },
    { id: 3, name: 'Jacket', category: 'Clothes', price: 60 },
    { id: 4, name: 'Sneakers', category: 'Shoes', price: 50 },
    { id: 5, name: 'Socks', category: 'Accessories', price: 5 },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  // Filter products by search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting products by price or name
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOrder === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'price') {
      return a.price - b.price;
    }
    return 0;
  });

  // Function to handle sorting
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Pagination logic
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const offset = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(offset, offset + productsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="container mt-5">
      {/* Search Bar */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search Products"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          {/* Sort Dropdown */}
          <select className="form-control" value={sortOrder} onChange={handleSortChange}>
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>
      </div>

      {/* Product Cards */}
      <div className="row">
        {sortedProducts.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">Category: {product.category}</p>
                <p className="card-text">Price: ${product.price}</p>
                <button className="btn btn-primary">Add to Cart</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <ReactPaginate
          pageCount={5} // Adjust according to your data
          onPageChange={() => {}}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          activeClassName="active"
        />
      </div>
    </div>
  );
};

export default ProductList;
