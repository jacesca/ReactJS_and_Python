import React, { useEffect } from 'react'
import { useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap"
// import { NumericFormat } from 'react-number-format';
// <NumberFormat value={2456981} displayType={'text'} thousandSeparator={true} prefix={'$'} />

import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import { createOrder } from '../actions/orderActions'


function PlaceOrderScreen() {
  const cart = useSelector(state => state.cart)
  // const orderCalulations = useSelector(state => state.orderCalulations)
  // const { error, loading, calculatedAmounts } = orderCalulations
  const orderCreate = useSelector(state => state.orderCreate)
  const { error, success, order } = orderCreate
  const dispatch = useDispatch()

  let history = useNavigate()
  useEffect(() => {
    if (success) {
      history(`/order/${order._id}`)
    }
  }, [history, order, success, dispatch])
  
  useEffect(() => {
    if (!cart.paymentMethod) {
      history('/payment')
    }
  })

  cart.itemsPrice = cart.cartItems.reduce((acc, item) => (acc + item.qty * item.price), 0)
  cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 10
  cart.taxPrice = cart.itemsPrice * 0.13
  // useEffect(() => {
  //   dispatch(getOrderCalculations(cart.itemsPrice))
  // }, [dispatch, cart])
  // cart.shippingPrice = calculatedAmounts.shippingPrice || 0.00
  // cart.taxPrice = calculatedAmounts.taxPrice || 0.00
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice

  const placeOrder = () => {
    dispatch(createOrder({
      'orderItems': cart.cartItems,
      'shippingAddresses': cart.shippingAddress,
      'paymentMethod': cart.paymentMethod,
      'itemsPrice': cart.itemsPrice.toFixed(2),
      'shippingPrice': cart.shippingPrice.toFixed(2),
      'taxPrice': cart.taxPrice.toFixed(2),
      'totalPrice': cart.totalPrice.toFixed(2),
    }))
  }

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />
      <h1><i className="fa-solid fa-truck" /> Place Order</h1>

      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Adress: </strong>
                { cart.shippingAddress.address }, {' '}
                { cart.shippingAddress.city } <br />
                { 'P.C. '}
                { cart.shippingAddress.postalCode }, {' '}
                { cart.shippingAddress.country }.
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                { cart.paymentMethod }.
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              { cart.cartItems.length === 0
                ? <Message variant='Info'>Your cart is empty!</Message>
                : <ListGroup variant='flush'>
                    {cart.cartItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={2}>
                            <Image src={item.image} alt={item.name} fluid rounded/>
                          </Col>

                          <Col md={4}>
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                          </Col>

                          <Col md={5}>
                            <Row className='justify-content-end'>
                              {item.qty} X 
                              ${item.price.toLocaleString("en-US", {style:"currency", currency:"USD"})} = {' '}
                              {(item.qty * item.price).toLocaleString("en-US", {style:"currency", currency:"USD"})}
                            </Row>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
              }              
            </ListGroup.Item>
          </ListGroup>
        </Col>
      
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              
              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col className='mr-5'>
                    <Row className='justify-content-end'>
                      {cart.itemsPrice.toLocaleString("en-US", {style:"currency", currency:"USD"})}                      
                    </Row>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col className='mr-5'>
                    <Row className='justify-content-end'>
                      {cart.shippingPrice.toLocaleString("en-US", {style:"currency", currency:"USD"})}
                    </Row>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col className='mr-5'>
                    <Row className='justify-content-end'>
                      {cart.taxPrice.toLocaleString("en-US", {style:"currency", currency:"USD"})}
                    </Row>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col className='mr-5'>
                    <Row className='justify-content-end'>
                      {cart.totalPrice.toLocaleString("en-US", {style:"currency", currency:"USD"})}
                    </Row>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>
                    Free shipping for items orders over $100!{'   '}
                    <i className="fa-solid fa-comment-dollar" />
                  </Col>
                </Row>
              </ListGroup.Item>
              
              <ListGroup.Item>
                <Row>
                  { error && <Message variant='danger'>{ error }</Message> }
                </Row>
              </ListGroup.Item>
              
              <ListGroup.Item>
                <Row>
                  <Button
                    type='button'
                    className='btn-block'
                    disabled={!cart.cartItems}
                    onClick={placeOrder}
                  >
                    Place Order
                  </Button>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PlaceOrderScreen
