import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Image, ListGroup, Button, Card, Form, Modal } from "react-bootstrap";

import Rating from "../components/Rating";
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listProductDetails, createReview } from '../actions/productActions' 
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants'


function ProductScreen() {
  let {id} = useParams()
  let history = useNavigate()

  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const dispatch = useDispatch()
  
  const productDetails = useSelector(state => state.productDetails)
  const { error, loading, product } = productDetails
  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin
  const productReviewCreate = useSelector(state => state.productReviewCreate)
  const { error:errorReviewCreate, loading:loadingReviewCreate, success:successReviewCreate } = productReviewCreate
  
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    // After saving a review, restore to initial values
    if (successReviewCreate) {
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_REVIEW_CREATE_RESET })
    } 

    dispatch(listProductDetails(id))
  }, [dispatch, id, successReviewCreate ])

  const addToCartHandler = () => {
    history(`/cart/${id}?qty=${qty}`)
  }

  const addReview = (e) => {
    e.preventDefault()
    dispatch(createReview({
      'rating': rating,
      'comment': comment,
      'product': id
    }))
    setShowModal(true);
  }
  const handleCloseModal = () => {
    if (successReviewCreate) {
      setRating(0)
      setComment('')
    }
    dispatch({ type: PRODUCT_REVIEW_CREATE_RESET })
    setShowModal(false);
  }

  return (
    <div>
      <Link to='/' className="btn btn-light my-3">Go Back</Link>
      { 
        loading ? <Loader />
          : error ? <Message variant='danger'>{error}</Message> 
          : <div>
              <Row>
                <Col md={5}>
                  <Image src={product.image} alt={product.name} fluid />
                </Col>

                <Col md={3}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <h3>{product.name}</h3>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <Rating value={product.rating} text={`${product.numReviews} reviews.`} color={"#f8e825"} />
                    </ListGroup.Item>

                    <ListGroup.Item>
                      Price: ${product.price}
                    </ListGroup.Item>

                    <ListGroup.Item>
                      {product.description}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>

                <Col md={4}>
                  <Card>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <Row>
                          <Col>Price:</Col>
                          <Col>
                            <strong>${product.price}</strong>
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Row>
                          <Col>Status:</Col>
                          <Col>
                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      {product.countInStock > 0 && (
                        <ListGroup.Item>
                          <Row>
                            <Col>Qty:</Col>
                            <Col>
                              <Form.Select value={qty} onChange={(e) => setQty(e.target.value)}>
                                {
                                  [...Array(product.countInStock).keys()].map((x) =>(
                                    <option key={x + 1} value={x + 1}>{x + 1}</option>
                                  ))
                                }
                              </Form.Select>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      )}

                      <ListGroup.Item>
                        <Row>
                            <Button 
                              onClick={addToCartHandler}
                              variant="dark" 
                              disabled={product.countInStock <= 0}
                              type='button'>
                              Add to Cart
                            </Button>
                        </Row>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col md={8}>
                  <h4>Reviews</h4>
                  { product.productreviews.length === 0 && <Message variant='info'>No reviews.</Message> }
                  
                  <ListGroup variant="flush">
                    { product.productreviews.map((review) => (
                      <ListGroup.Item key={ review._id }>
                        <strong>{ review.name }</strong>
                        <Rating value={ review.rating } color={"#f8e825"} />
                        <p>{ review.createdAt.substring(0, 10) }</p>
                        <p>{ review.comment }</p>
                      </ListGroup.Item>
                    )) }
                  </ListGroup>
                  
                  <h4>Write a review</h4>
                  { loadingReviewCreate && <Loader /> }
                  { successReviewCreate && <Message variant='success'>Review submitted.</Message> }
                  { errorReviewCreate && <Message variant='danger'>{errorReviewCreate}</Message> }
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      { userInfo 
                        ? <div>
                            <Form onSubmit={addReview}>
                              <Form.Group controlId="rating">
                                <Form.Label>Rating</Form.Label>
                                <Form.Control
                                  as='select'
                                  value={rating}
                                  onChange={(e) => setRating(e.target.value)}
                                  >
                                  <option value=''>Select...</option>
                                  {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'].map((v, i) => (
                                    <option value={i+1} key={i+1}>{`${i+1} - ${v}`}</option>
                                  ))}
                                </Form.Control>
                              </Form.Group><br />

                              <Form.Group controlId="comment">
                                <Form.Label>Review</Form.Label>
                                <Form.Control
                                  as='textarea'
                                  rows={5}
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)} />
                              </Form.Group><br />

                              <Button 
                                disabled={loadingReviewCreate}
                                type='submit'
                                variant="primary">
                                Submit
                              </Button>
                            </Form>
                            <Modal show={showModal} onHide={handleCloseModal}>
                              <Modal.Header closeButton>
                                <Modal.Title>Product Review</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                { errorReviewCreate 
                                  ? <Message variant='danger'>{errorReviewCreate}</Message>
                                  : <Message variant='info'><p>Review submitted.</p></Message> 
                                }
                              </Modal.Body>
                              <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                              </Modal.Footer>
                            </Modal>
                          </div>
                        : <Message variant='info'>Please <Link to='/login'>Login</Link> to write a review.</Message> 
                      }
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col md={4}></Col>
              </Row>
            </div>
      }
    </div>
  );
}

export default ProductScreen;
