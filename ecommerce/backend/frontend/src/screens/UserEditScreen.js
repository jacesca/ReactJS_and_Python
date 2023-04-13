import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from "react-bootstrap"

import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import UserForm from '../components/UserForm'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'

function UserEditScreen() {
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  
  const dispatch = useDispatch()

  const back_url = '/admin/userlist'

  let {id:userId} = useParams()
  let history = useNavigate()

  const userDetails = useSelector(state => state.userDetails)
  const { error, loading, user } = userDetails
  const userUpdate = useSelector(state => state.userUpdate)
  const { error:errorUpdate, loading:loadingUpdate, success:successUpdate } = userUpdate

  useEffect(() => {
    if(successUpdate) {
      dispatch({ type: USER_UPDATE_RESET })
      history(back_url)
    } else if (!user.username || user._id !== Number(userId)) {
      dispatch(getUserDetails(userId))
    } else {
      setFirstname(user.first_name)
      setLastname(user.last_name)
      setEmail(user.email)
      setIsAdmin(user.is_staff)
    }
  }, [user, userId, dispatch, successUpdate, history])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateUser({
      id: user._id,
      username: email,
      first_name: firstname, 
      last_name: lastname,
      email: email,
      is_staff: isAdmin
    }))
  }

  return (
    <div>
      <Link to={back_url}>Go back</Link>
      
      <FormContainer>
        <h1>Edit User</h1>

        { loadingUpdate && <Loader /> }
        { errorUpdate && <Message variant='danger'>{ errorUpdate }</Message> }
        
        { loading 
          ? <Loader />
          : error ? <Message variant='danger'>{ error }</Message> 
          : <Form onSubmit={ submitHandler }>
              <UserForm 
                firstname={firstname}
                lastname={lastname}
                email={email}
                setFirstname={setFirstname}
                setLastname={setLastname}
                setEmail={setEmail}
              />

              <Form.Group controlId='isadmin'>
                <Form.Check 
                  type='checkbox' 
                  label='Is Admin?' 
                  checked={ isAdmin } 
                  onChange = { (e) => setIsAdmin(e.target.checked) } />
              </Form.Group><br />

              <Button type='submit' variant='primary'>Update</Button>
            </Form>
        }
      </FormContainer> 
    </div>
  )
}

export default UserEditScreen
