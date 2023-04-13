import React from 'react'
import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'


function CheckoutSteps({ step1, step2, step3, step4 }) {
  return (
    <Nav className="justify-content-center">
      <Nav.Item>
        <LinkContainer to={'/cart'}>
          <Nav.Link disabled={!step1}>
            <i className="fas fa-shopping-cart" /> Cart
          </Nav.Link> 
        </LinkContainer>
      </Nav.Item> 
      <Nav.Item>
        <LinkContainer to='/shipping'>
          <Nav.Link disabled={!step2}>
            <i className="fa-solid fa-map-location" /> Shipping
          </Nav.Link> 
        </LinkContainer>
      </Nav.Item> 
      <Nav.Item>
        <LinkContainer to='/payment'>
          <Nav.Link disabled={!step3}>
            <i className="fa-solid fa-bag-shopping" /> Payment
          </Nav.Link> 
        </LinkContainer>
      </Nav.Item> 
      <Nav.Item>
        <LinkContainer to='/placeorder'>
          <Nav.Link disabled={!step4}>
            <i className="fa-solid fa-truck" /> Place Order
          </Nav.Link> 
        </LinkContainer>
      </Nav.Item>        
    </Nav>
  )
}

export default CheckoutSteps
