import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, Pagination } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { FaSearch, FaStar, FaRegStar, FaSlidersH, FaTimes } from 'react-icons/fa';
import { productService } from '../services/productService';
import ProductCard from '../components/products/ProductCard';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search, Pagination, and Filters State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter Inputs
  const [searchText, setSearchText] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedRating, setSelectedRating] = useState(searchParams.get('ratings') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await productService.getCategories();
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products when searchParams change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          search: searchParams.get('search') || '',
          category: searchParams.get('category') || '',
          minPrice: searchParams.get('minPrice') || '',
          maxPrice: searchParams.get('maxPrice') || '',
          ratings: searchParams.get('ratings') || '',
          sort: searchParams.get('sort') || '-createdAt',
          page: searchParams.get('page') || 1,
          limit: 6
        };

        const { data } = await productService.getProducts(params);
        setProducts(data.products || []);
        setPage(data.page || 1);
        setTotalPages(data.pages || 1);
      } catch (err) {
        console.error('Error fetching products:', err);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  // Handle filter submission
  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const newParams = {};
    if (searchText) newParams.search = searchText;
    if (selectedCategory) newParams.category = selectedCategory;
    if (minPrice) newParams.minPrice = minPrice;
    if (maxPrice) newParams.maxPrice = maxPrice;
    if (selectedRating) newParams.ratings = selectedRating;
    if (sort) newParams.sort = sort;
    newParams.page = 1; // reset page on new filters

    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedRating('');
    setSort('-createdAt');
    setSearchParams({});
  };

  const handlePageChange = (pageNumber) => {
    const currentParams = Object.fromEntries([...searchParams]);
    setSearchParams({ ...currentParams, page: pageNumber });
  };

  return (
    <Container className="py-4">
      {/* Page Header */}
      <div className="page-header d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 p-4 rounded bg-gradient-primary text-white shadow animate-fadeInUp">
        <h1 className="fw-bold mb-2 mb-md-0">All Products</h1>
        <Form onSubmit={handleApplyFilters} style={{ maxWidth: '400px', width: '100%' }}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border-0 shadow-none"
            />
            <Button type="submit" variant="light" className="text-primary border-0">
              <FaSearch />
            </Button>
          </InputGroup>
        </Form>
      </div>

      <Row className="g-4">
        {/* Filter Sidebar */}
        <Col lg={3} className="animate-fadeInUp">
          <Card className="filter-sidebar border-0 shadow-sm p-3 rounded">
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                <FaSlidersH /> Filters
              </h5>
              <Button variant="link" onClick={handleClearFilters} className="text-decoration-none text-muted p-0 fs-7">
                Clear All
              </Button>
            </div>

            <Form onSubmit={handleApplyFilters}>
              {/* Category Filter */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Category</Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Price Range Filter */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Price Range</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    min="0"
                  />
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    min="0"
                  />
                </div>
              </Form.Group>

              {/* Rating Filter */}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Minimum Rating</Form.Label>
                <div className="d-flex gap-1 align-items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="border-0 bg-transparent p-1"
                      onClick={() => setSelectedRating(star === parseInt(selectedRating) ? '' : star.toString())}
                    >
                      {star <= parseInt(selectedRating || '0') ? (
                        <FaStar className="text-warning fs-5" />
                      ) : (
                        <FaRegStar className="text-muted fs-5" />
                      )}
                    </button>
                  ))}
                  {selectedRating && <span className="ms-2 text-muted">({selectedRating}+)</span>}
                </div>
              </Form.Group>

              {/* Sort Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Sort By</Form.Label>
                <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="-createdAt">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-ratings">Top Rated</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" className="btn-primary-custom w-100">
                Apply Filters
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Products Grid */}
        <Col lg={9} className="animate-fadeInUp">
          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <Card className="border-0 shadow-sm text-center py-5 rounded">
              <Card.Body>
                <div className="fs-1 text-muted mb-3">🛍️</div>
                <h4 className="fw-bold">No Products Found</h4>
                <p className="text-muted">Try adjusting your filters or search terms.</p>
                <Button variant="outline-primary" onClick={handleClearFilters}>
                  Reset Filters
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <>
              <Row className="g-4 mb-4">
                {products.map((product) => (
                  <Col key={product._id} xs={12} sm={6} md={4}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                  <Pagination>
                    <Pagination.Prev
                      disabled={page === 1}
                      onClick={() => handlePageChange(page - 1)}
                    />
                    {[...Array(totalPages).keys()].map((num) => (
                      <Pagination.Item
                        key={num + 1}
                        active={num + 1 === page}
                        onClick={() => handlePageChange(num + 1)}
                      >
                        {num + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      disabled={page === totalPages}
                      onClick={() => handlePageChange(page + 1)}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductsPage;
