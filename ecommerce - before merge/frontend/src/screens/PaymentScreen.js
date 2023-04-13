import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux' 
import { Form, Button, Col, Row } from "react-bootstrap"

import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import { savePaymentMethod } from '../actions/cartActions'


function PaymentScreen() {
  const cart = useSelector(state => state.cart)
  const { shippingAddress } = cart
  const dispatch = useDispatch()
  
  const paymentOptions = [
    { label: 'PayPal', iconClass: 'fab fa-cc-paypal' }, // Default if not paymentMethod
    { label: 'Visa', iconClass: 'fab fa-cc-visa' },
    { label: 'Mastercard', iconClass: 'fab fa-cc-mastercard' },
    { label: 'Apple Pay', iconClass: 'fab fa-cc-apple-pay' }
  ];
  const [paymentMethod, setPaymentMethod] = useState(
    cart.paymentMethod || paymentOptions[0].label
  ) 

  const history = useNavigate()

  useEffect(() => {
    if (!shippingAddress.address || cart.cartItems.length===0) {
      history('/shipping')
    }
  }, [shippingAddress, cart, history])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    history('/placeorder')
  }

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1><i className="fa-solid fa-bag-shopping" /> Payment Method</h1>

      <Form onSubmit={submitHandler}>

        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Row>
            {paymentOptions.map((paymentOption) => (
                <Col key={paymentOption.label}>
                  <Form.Check 
                    type='radio' 
                    inline 
                    name='paymentMethod'
                    label={paymentOption.label} 
                    id={paymentOption.label} 
                    checked={ paymentOption.label === paymentMethod }
                    onChange={ () => setPaymentMethod(paymentOption.label) } />
                  <i className={ paymentOption.iconClass } />
                </Col>
              ))
            } 
          </Row>          
        </Form.Group><br />

        <Button type='submit' variant='primary'>
          Continue
        </Button>

      </Form>
    </FormContainer>
  )
}

export default PaymentScreen

