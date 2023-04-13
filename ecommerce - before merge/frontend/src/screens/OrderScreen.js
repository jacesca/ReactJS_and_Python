import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap"
import { PayPalButton } from 'react-paypal-button-v2'

import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { PAYPAL_CLIENTID } from '../constants/paypalConstants'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'


function OrderScreen() {
  const {orderId} = useParams()
  const dispatch = useDispatch()
  const orderDetails = useSelector(state => state.orderDetails)
  const { order, error, loading } = orderDetails
  
  const [sdkReady, setSdkReady] = useState(false)
  const orderPay = useSelector(state => state.orderPay)
  const { loading:loadingPay, success:successPay } = orderPay
  const orderDeliver = useSelector(state => state.orderDeliver)
  const { loading:loadingDeliver, success:successDeliver } = orderDeliver
  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const back_url = '/admin/orderlist'
  let history = useNavigate()

  if (!loading && !error) { order.additional_comment = 'Order loaded succesfully!' }

  const addPayPalScript = () => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src=`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENTID}`
    script.async=true
    script.onload = () => { setSdkReady(true) }
    document.body.appendChild(script)
  }

  useEffect(() => {
    if (!userInfo) {
      history(back_url)
    } else if (!order || successPay || order._id !== Number(orderId) || successDeliver) { 
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId)) 
    } else if (!order.isPaid) {
      if (!window.paypal) { addPayPalScript() }
      else { setSdkReady(true) }
    }
  }, [order, orderId, dispatch, successPay, successDeliver, history, userInfo])

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, { "isPaid": true }))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(orderId))
  }

  return loading ? ( <Loader /> ) : 
         error ? ( <Message variant='danger'>{error}</Message>) 
         : (<div>
              { userInfo && userInfo.is_staff && <Link to={back_url}>Go back</Link> }
              <h1><i className="fa-solid fa-truck" /> Order No.{orderId}</h1>
              <Row>
                <Col md={8}>
                  <ListGroup variant='flush'>
                    <ListGroup.Item>
                      <h2>Shipping</h2>
                      <p><strong>User: </strong> {order.user_fullname}</p>
                      <p><strong>Email: </strong> <a href={`mailto:${order.user}`}>{order.user}</a></p>
                      <p>
                        <strong>Adress: </strong>
                        { order.shippingAddresses.address }, {' '}
                        { order.shippingAddresses.city } <br />
                        { 'P.C. '}
                        { order.shippingAddresses.postalCode }, {' '}
                        { order.shippingAddresses.country }.
                      </p>
                      {
                        order.isDelivered 
                        ? <Message variant='success'>Delivered on {Date(order.deliveredAt).toString()}</Message> 
                        : <Message variant='warning'>Not delivered</Message> 
                      }
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <h2>Payment Method</h2>
                      <p>
                        <strong>Method: </strong>
                        { order.paymentMethod }.
                      </p>
                      {
                        order.isPaid 
                        ? <Message variant='success'>Paid on {Date(order.paidAt).toString()}</Message> 
                        : <Message variant='warning'>Not paid</Message> 
                      }
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <h2>Order Items</h2>
                      { order.orderItems.length === 0 ? <Message variant='Info'>Your order is empty!</Message>
                        : <ListGroup variant='flush'>
                            {order.orderItems.map((item, index) => (
                              <ListGroup.Item key={index}>
                                <Row>
                                  <Col md={2}><Image src={item.image} alt={item.name} fluid rounded/></Col>
                                  <Col md={4}><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
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
                              {order.itemsPrice.toLocaleString("en-US", {style:"currency", currency:"USD"})}                      
                            </Row>
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Row>
                          <Col>Shipping:</Col>
                          <Col className='mr-5'>
                            <Row className='justify-content-end'>
                              {order.shippingPrice.toLocaleString("en-US", {style:"currency", currency:"USD"})}
                            </Row>
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Row>
                          <Col>Tax:</Col>
                          <Col className='mr-5'>
                            <Row className='justify-content-end'>
                              {order.taxPrice.toLocaleString("en-US", {style:"currency", currency:"USD"})}
                            </Row>
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <Row>
                          <Col>Total:</Col>
                          <Col className='mr-5'>
                            <Row className='justify-content-end'>
                              {order.totalPrice.toLocaleString("en-US", {style:"currency", currency:"USD"})}
                            </Row>
                          </Col>
                        </Row>
                      </ListGroup.Item>

                      { !order.isPaid && (order.user===userInfo.id) && (
                        <ListGroup.Item>
                          <Row>
                            { loadingPay && <Loader /> }
                            { !sdkReady ? <Loader />
                              : <PayPalButton 
                                  amount={order.totalPrice}
                                  onSuccess={successPaymentHandler}
                                />
                            }
                          </Row>
                        </ListGroup.Item>
                      )}
                      
                      { loadingDeliver && <Loader /> }
                      { userInfo && userInfo.is_staff && order.isPaid && !order.isDelivered && (
                        <ListGroup.Item>
                          <Row>
                            <Button 
                              type='button'
                              className='btn btn-block'
                              onClick={deliverHandler}
                            >
                              <i className="fa-solid fa-truck-ramp-box" /> Mark as Delivered
                            </Button>
                          </Row>
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
            </div>
           )
}

export default OrderScreen
