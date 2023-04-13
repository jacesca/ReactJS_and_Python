import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom" // Link, useSearchParams
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col, Table } from "react-bootstrap"

import Loader from '../components/Loader'
import Message from '../components/Message'
import UserForm from '../components/UserForm'
import PwdForm from '../components/PwdForm'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'
import { ORDER_LIST_RESET } from '../constants/orderConstants'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { getOrderList } from '../actions/orderActions'


function ProfileScreen() {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  
  const dispatch = useDispatch()
  const history = useNavigate()
  
  const userDetails = useSelector(state => state.userDetails)
  const { error, loading, user } = userDetails

  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin

  const userUpdateProfile = useSelector(state => state.userUpdateProfile)
  const { success } = userUpdateProfile

  const orderList = useSelector(state => state.orderList)
  const { loading:loadingOrders, error:errorOrders, orders } = orderList

  useEffect(() => {
    if (!userInfo) {
      history('/login')
    } 
    dispatch(getOrderList(userInfo._id))
    if (!user || !user.email || success || userInfo._id !== user.id) {
      dispatch({ type: USER_UPDATE_PROFILE_RESET })
      dispatch({ type: ORDER_LIST_RESET })
      dispatch(getUserDetails('profile'))
    } else {
      setFirstname(user.first_name)
      setLastname(user.last_name)
      setEmail(user.email)
    }
  }, [dispatch, history, userInfo, user, success])

  const submitHandler = (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!')
    } else {
      dispatch(updateUserProfile(
        user._id,
        {
          'username': email,
          'first_name': firstname, 
          'last_name': lastname, 
          'email': email, 
          'password': password
        }
      ))
      setMessage('')
    }
  }

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>

        { message && <Message variant='danger'>{ message }</Message> }
        { error && <Message variant='danger'>{ error }</Message> }
        { loading && <Loader /> }

        <Form onSubmit={ submitHandler }>
          <UserForm 
            firstname={firstname}
            lastname={lastname}
            email={email}
            setFirstname={setFirstname}
            setLastname={setLastname}
            setEmail={setEmail}
          />

          <PwdForm
            password={password}
            confirmPassword={confirmPassword}
            setPassword={setPassword}
            setConfirmPassword={setConfirmPassword}
          />

          <Button type='submit' variant='primary'>Update</Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        { loadingOrders 
          ? <Loader /> 
          : errorOrders 
          ? <Message variant='danger'>{errorOrders}</Message> 
          : <Table striped bordered hover size="sm" className="table table-hover">
            <thead>
              <tr>
                {['Id', 'Date', 'Total', 'Paid', 'Delivered', ''].map(title => (
                  <th scope="col" key={title}>{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice.toLocaleString("en-US", {style:"currency", currency:"USD"})}</td>
                  <td>                  
                    { order.isPaid ? <i className="fa-solid fa-clipboard-check" />
                                  : <i className='fa-solid fa-hourglass-half' style={{ color: 'red' }} />
                    }{'  '}
                    { order.paidAt && order.paidAt.substring(0, 10) } 
                  </td>
                  <td>
                    { order.isDelivered && <i className="fa-solid fa-house-circle-check"></i> }{'  '}
                    {order.deliveredAt}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}/`}>
                      <Button className='btn-sm'>Details</Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        }
      </Col>
    </Row>
  )
}

export default ProfileScreen
