import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom"
import Product from "../components/Product";
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import { listProducts } from '../actions/productActions'


function HomeScreen() {
  const queryParameters = new URLSearchParams(window.location.search)
  const search = queryParameters.get("search")
  // const page = queryParameters.get("page")
  let keywords = window.location.search
  let history = useNavigate()
  const dispatch = useDispatch()
  const productList = useSelector(state => state.productList)
  const { error, loading, products, page, totalPages } = productList
  
  useEffect(() => {
    dispatch(listProducts(keywords))
  }, [dispatch, keywords, history ])

  return (
    <div>
      {!keywords && <ProductCarousel />}
      <h1>Latest Products</h1>
      {
        loading ? <Loader /> 
          : error ? <Message variant='danger'>{error}</Message> 
          : <div>
              <Row>
                {products && products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <Paginate page={page?page:1} pages={totalPages} search={search ? `search=${search}` : ''} />
            </div>
      }
    </div>
  );
}

export default HomeScreen;
