import React, { useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Form, Card, Dropdown, Modal } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import './HomePage.css';

const HomePage = ({ logout }) => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', category: 'Clothes', photo: 'https://via.placeholder.com/150', price: 50, details: 'Details about Product 1' },
    { id: 2, name: 'Product 2', category: 'Shoes', photo: 'https://via.placeholder.com/150', price: 80, details: 'Details about Product 2' },
    { id: 3, name: 'Product 3', category: 'Watches', photo: 'https://via.placeholder.com/150', price: 120, details: 'Details about Product 3' },
  ]);

  const categories = ['Clothes', 'Shoes', 'Watches'];

  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ id: '', name: '', category: '', photo: '', price: '', details: '' });
  const productsPerPage = 3;

  const handleCloseModal = () => {
    setShowModal(false);
    setNewProduct({ id: '', name: '', category: '', photo: '', price: '', details: '' });
    setEditingProduct(null);
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setNewProduct(product);
    }
    setShowModal(true);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      // Edit existing product
      setProducts(products.map(p => (p.id === editingProduct.id ? newProduct : p)));
    } else {
      // Add new product
      setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    }
    handleCloseModal();
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  // Filter and sort products
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'All' || product.category === selectedCategory)
  );

  const sortedProducts = filteredProducts.slice().sort((a, b) => {
    if (sortField === 'name') {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    } else if (sortField === 'price') {
      const comparison = a.price - b.price;
      return sortOrder === 'asc' ? comparison : -comparison;
    }
    return 0;
  });

  const pageCount = Math.ceil(sortedProducts.length / productsPerPage);
  const offset = currentPage * productsPerPage;
  const currentProducts = sortedProducts.slice(offset, offset + productsPerPage);

  const handlePageClick = ({ selected }) => setCurrentPage(selected);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 custom-navbar">
        <Container>
          <Navbar.Brand>Product Dashboard</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Form className="d-flex search-form">
                <Form.Control
                  type="search"
                  placeholder="Search products"
                  className="mr-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Form>
              <Button variant="outline-light" onClick={logout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={3} className="mb-4">
            <div className="sidebar">
              <h5>Categories</h5>
              <ul className="list-unstyled">
                <li className={`category-item ${selectedCategory === 'All' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('All')}>
                  All
                </li>
                {categories.map(category => (
                  <li key={category} className={`category-item ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}>
                    {category}
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* Product List */}
          <Col md={9}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>Products</h2>
              <div>
                <Button variant="primary" onClick={() => handleShowModal()}>Add Product</Button>
                <Dropdown className="ml-3">
                  <Dropdown.Toggle variant="secondary">
                    Sort by {sortField.charAt(0).toUpperCase() + sortField.slice(1)}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => { setSortField('name'); toggleSortOrder(); }}>
                      Name {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => { setSortField('price'); toggleSortOrder(); }}>
                      Price {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            {currentProducts.length === 0 ? (
              <div className="no-products-message">
                <p>No products available. Try adjusting your filters or add new products.</p>
              </div>
            ) : (
              <Row className="product-list">
                {currentProducts.map(product => (
                  <Col md={4} key={product.id} className="mb-4">
                    <Card className="product-card shadow-sm">
                      <Card.Img variant="top" src={product.photo} className="card-img-top" />
                      <Card.Body>
                        <Card.Title>{product.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">${product.price.toFixed(2)}</Card.Subtitle>
                        <Card.Text>{product.details}</Card.Text>
                        <div className="d-flex justify-content-between">
                          <Button variant="danger" className="btn-sm" onClick={() => handleDeleteProduct(product.id)}>Remove</Button>
                          <Button variant="secondary" className="btn-sm" onClick={() => handleShowModal(product)}>Edit</Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            {sortedProducts.length > productsPerPage && (
              <div className="d-flex justify-content-center mt-4">
                <ReactPaginate
                  previousLabel={'Previous'}
                  nextLabel={'Next'}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination'}
                  pageClassName={'page-item'}
                  pageLinkClassName={'page-link'}
                  previousClassName={'page-item'}
                  previousLinkClassName={'page-link'}
                  nextClassName={'page-item'}
                  nextLinkClassName={'page-link'}
                  activeClassName={'active'}
                />
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* Modal for Add/Edit Product */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? 'Edit Product' : 'Add Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProductName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formProductCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formProductPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
              />
            </Form.Group>
            <Form.Group controlId="formProductDetails">
              <Form.Label>Details</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product details"
                value={newProduct.details}
                onChange={(e) => setNewProduct({ ...newProduct, details: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formProductPhoto">
              <Form.Label>Photo URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter photo URL"
                value={newProduct.photo}
                onChange={(e) => setNewProduct({ ...newProduct, photo: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            {editingProduct ? 'Save Changes' : 'Add Product'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HomePage;
