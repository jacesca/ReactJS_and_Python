import React, { useEffect } from 'react'
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'

import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import { addToCart, removeFromCart } from '../actions/cartActions'

function CartScreen() {
  const {productId} = useParams();
  // const qty = useSearchParams()[0].get("qty");
  const [searchParams, ] = useSearchParams(); //second item returned: setSearchParams
  const qty = searchParams.get("qty") ? searchParams.get("qty") : 1 
  
  const history = useNavigate()
  const dispatch = useDispatch()
  const cart = useSelector(state => state.cart)
  const {cartItems} = cart
  
  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, Number(qty)))
    }
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (productId) => {
    dispatch(removeFromCart(productId))
  }

  const checkoutHandler = () => {
    history('/login?redirect=/shipping')
  }

  return (
    <Row>
      <CheckoutSteps step1 />
      <h1><i className="fas fa-shopping-cart" /> Shopping Cart</h1>
      <Col md={8}>
        {
          cartItems.length === 0
          ?( 
            <Message variant='info'>
              Your cart is empty. <Link to='/'>Go Back</Link>
            </Message>
          ):(
            <ListGroup variant='flush'>
              {cartItems.map(item => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>
                      <Row className='justify-content-end'>
                        ${item.price.toLocaleString("en-US", {style:"currency", currency:"USD"})}
                      </Row>
                    </Col>
                    <Col md={3}>
                      <Form.Select value={item.qty} 
                        onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                        {
                          [...Array(item.countInStock).keys()].map((x) =>(
                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                          ))
                        }
                      </Form.Select>
                    </Col>

                    <Col md={1}> 
                      <Button type='button' variant='light'
                        onClick={() => removeFromCartHandler(item.product)}>
                        <i className='fas fa-trash' />
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )
        }
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                SubTotal ({
                  cartItems.reduce((acc, item) => acc + item.qty, 0)
                }) items
              </h2>
              {cartItems.reduce((acc, item) => 
                acc + item.qty * item.price, 0).toLocaleString(
                  "en-US", 
                  {style:"currency", currency:"USD", minimumFractionDigits: 2, maximumFractionDigits:2}
                )
              }
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Button type='button' className='btn-black'
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}>
                  Proceed To Checkout
                </Button>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default CartScreen
