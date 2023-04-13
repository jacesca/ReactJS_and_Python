import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button, Row, Col } from "react-bootstrap"

import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import UserForm from '../components/UserForm'
import PwdForm from '../components/PwdForm'
import { register } from '../actions/userActions'

function RegisterScreen() {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const dispatch = useDispatch()

  let history = useNavigate()
  const [searchParams, ] = useSearchParams(); //second item returned: setSearchParams
  const redirect = searchParams.get("redirect") ? searchParams.get("redirect") : '/'

  const userRegister = useSelector(state => state.userRegister)
  const { error, loading, userInfo } = userRegister

  useEffect(() => {
    if (userInfo) {
      history(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!')
    } else {
      dispatch(register(firstname, lastname, email, password))
    }
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      
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

        <Button type='submit' variant='primary'>Register</Button>
      </Form>

      <Row className='py-3'>
        <Col>
        Have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Sing In</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
