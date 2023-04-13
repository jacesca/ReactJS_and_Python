import React from "react";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom"
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../actions/userActions'
import SearchBox from './SearchBox'

function NavScrollBar() {

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const dispatch = useDispatch()

  let history = useNavigate()
  const logoutHandler = () => {
    dispatch(logout())
    history('/')
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>ProShop</Navbar.Brand>
        </LinkContainer>      
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/cart">
              <Nav.Link>
                <i className="fas fa-shopping-cart" /> Cart
              </Nav.Link>
            </LinkContainer>

            {userInfo && userInfo.is_staff && (
              <NavDropdown title="Admin" id="adminmenu">
                <LinkContainer to="/admin/userlist">
                  <NavDropdown.Item>Users</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/productlist">
                  <NavDropdown.Item>Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/orderlist">
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>                
              </NavDropdown>
            )}
          </Nav>
          
          <Nav>
            { userInfo 
              ?  (
                <NavDropdown title={ userInfo.first_name } id={ userInfo.first_name }>
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={ logoutHandler }>Logout</NavDropdown.Item>                  
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className="fas fa-user" /> Login
                  </Nav.Link>
                </LinkContainer>
              )
            }
          </Nav>

          <SearchBox />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

function Header() {
  return (
    <header>
      <NavScrollBar />
    </header>
  );
}

export default Header;
