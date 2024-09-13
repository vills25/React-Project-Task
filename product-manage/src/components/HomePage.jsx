import React, { useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Form, ListGroup, Card, Dropdown, Modal } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { FaSortUp, FaSortDown } from 'react-icons/fa';

const HomePage = ({ logout }) => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', category: 'Clothes', photo: 'https://via.placeholder.com/150', price: 50, details: 'Details about Product 1' },
    { id: 2, name: 'Product 2', category: 'Shoes', photo: 'https://via.placeholder.com/150', price: 80, details: 'Details about Product 2' },
    { id: 3, name: 'Product 3', category: 'Watches', photo: 'https://via.placeholder.com/150', price: 120, details: 'Details about Product 3' },
  ]);

  const [newProduct, setNewProduct] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [editModal, setEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedPrice, setEditedPrice] = useState('');
  const [editedDetails, setEditedDetails] = useState('');
  const [newImage, setNewImage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const productsPerPage = 3;

  // Filter and sort products
  const filteredProducts = products
    .filter(product =>
      selectedCategory === 'All' || product.category === selectedCategory
    )
    .filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleAddProduct = () => {
    const newId = products.length + 1;
    const category = selectedCategory !== 'All' ? selectedCategory : 'Clothes';
    setProducts([...products, {
      id: newId,
      name: newProduct,
      category,
      photo: newImage || 'https://via.placeholder.com/150',
      price: parseFloat(newPrice),
      details: newDetails
    }]);
    // Clear inputs
    setNewProduct('');
    setNewPrice('');
    setNewDetails('');
    setNewImage('');
  };
  

  const handleRemoveProduct = (id) => setProducts(products.filter(product => product.id !== id));

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Open Edit Modal
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setEditedName(product.name);
    setEditedPrice(product.price);
    setEditedDetails(product.details);
    setEditModal(true);
  };

  // Save edited product
  const handleSaveProduct = () => {
    setProducts(products.map(product =>
      product.id === currentProduct.id
        ? { ...product, name: editedName, price: parseFloat(editedPrice), details: editedDetails }
        : product
    ));
    setEditModal(false);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>Product Dashboard</Navbar.Brand>
          <Nav className="ml-auto">
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="mr-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-primary" onClick={logout}>Logout</Button>
            </Form>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid className="mt-4">
        <Row>
          {/* Sidebar for Categories */}
          <Col md={2}>
            <h5>Categories</h5>
            <ListGroup>
              <ListGroup.Item action onClick={() => setSelectedCategory('All')} active={selectedCategory === 'All'}>
                All Products
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => setSelectedCategory('Clothes')} active={selectedCategory === 'Clothes'}>
                Clothes
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => setSelectedCategory('Shoes')} active={selectedCategory === 'Shoes'}>
                Shoes
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => setSelectedCategory('Watches')} active={selectedCategory === 'Watches'}>
                Watches
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* Main Content */}
          <Col md={10}>
            <h2 className="my-4">
              Products
              <Dropdown className="d-inline mx-2">
                <Dropdown.Toggle variant="link">
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
            </h2>

            {/* Add New Product */}
            <Form.Group controlId="addProduct">
              <Form.Control
                type="text"
                placeholder="Product Name"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
              />
              <Form.Control
                type="number"
                placeholder="Price"
                className="mt-2"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
              <Form.Control
                type="text"
                placeholder="Details"
                className="mt-2"
                value={newDetails}
                onChange={(e) => setNewDetails(e.target.value)}
              />
              <Button className="mt-2" variant="primary" onClick={handleAddProduct}>
                Add Product
              </Button>
            </Form.Group>

            {/* Product List */}
            <Row className="mt-3">
              {currentProducts.map(product => (
                <Col md={4} key={product.id} className="mb-3">
                  <Card className="product-card">
                    <Card.Img variant="top" src={product.photo} />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">${product.price.toFixed(2)}</Card.Subtitle>
                      <Card.Text>{product.details}</Card.Text>
                      <Button variant="danger" className="mr-2" onClick={() => handleRemoveProduct(product.id)}>Remove</Button>
                      <Button variant="secondary" onClick={() => handleEditProduct(product)}>Edit</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
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
          </Col>
        </Row>
      </Container>

      {/* Edit Product Modal */}
      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editProductName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editProductPrice" className="mt-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={editedPrice}
                onChange={(e) => setEditedPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editProductDetails" className="mt-2">
              <Form.Label>Details</Form.Label>
              <Form.Control
                type="text"
                value={editedDetails}
                onChange={(e) => setEditedDetails(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productImageUpload">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setNewImage(reader.result);
                  };
                  if (file) {
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveProduct}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HomePage;
