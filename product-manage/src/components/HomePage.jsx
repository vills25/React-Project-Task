import React, { useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, ListGroup, Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

const HomePage = ({ logout }) => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Product 1', category: 'Category 1' },
    { id: 2, name: 'Product 2', category: 'Category 2' },
    { id: 3, name: 'Product 3', category: 'Category 3' },
  ]);

  const [newProduct, setNewProduct] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 5;

  // Pagination logic
  const filteredProducts = selectedCategory === 'All' ? products : products.filter(p => p.category === selectedCategory);
  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const offset = currentPage * productsPerPage;
  const currentProducts = filteredProducts.slice(offset, offset + productsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleAddProduct = () => {
    const id = products.length + 1;
    const category = selectedCategory !== 'All' ? selectedCategory : 'Category 1'; // Default category
    setProducts([...products, { id, name: newProduct, category }]);
    setNewProduct('');
  };

  const handleRemoveProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <>
      {/* Navbar */}
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>Product Dashboard</Navbar.Brand>
          <Nav className="ml-auto">
            <Button onClick={logout}>Logout</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid>
        <Row>
          {/* Sidebar for Categories */}
          <Col md={2}>
            <ListGroup>
              <ListGroup.Item action onClick={() => setSelectedCategory('All')} active={selectedCategory === 'All'}>
                All Categories
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => setSelectedCategory('Category 1')} active={selectedCategory === 'Category 1'}>
                Clothes
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => setSelectedCategory('Category 2')} active={selectedCategory === 'Category 2'}>
                Shoes
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => setSelectedCategory('Category 3')} active={selectedCategory === 'Category 3'}>
                Watches
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* Main Content */}
          <Col md={10}>
            <h2 className="my-4">Products</h2>

            {/* Add New Product */}
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Add New Product"
                value={newProduct}
                onChange={(e) => setNewProduct(e.target.value)}
              />
              <Button className="mt-2" onClick={handleAddProduct}>
                Add Product
              </Button>
            </Form.Group>

            {/* Product List */}
            <ListGroup>
              {currentProducts.map((product) => (
                <ListGroup.Item key={product.id} className="d-flex justify-content-between">
                  {product.name}
                  <Button variant="danger" onClick={() => handleRemoveProduct(product.id)}>
                    Remove
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>

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
    </>
  );
};

export default HomePage;
