import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Modal } from "react-bootstrap"

import Loader from '../components/Loader'
import Message from '../components/Message'
import { listUsers, deleteUser } from '../actions/userActions' 

function UserListScreen() {
  const dispatch = useDispatch()
  const userList = useSelector(state => state.userList)
  const { loading, error, users } = userList
  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin
  const userDelete = useSelector(state => state.userDelete)
  const { success:successDelete } = userDelete
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});

  let history = useNavigate()

  useEffect(() => {
    if ( userInfo && userInfo.is_staff ){
      dispatch(listUsers())
    } else {
      history('/login')
    }
  }, [dispatch, history, userInfo, successDelete])

  const handleDeleteClick = (id, name) => { 
    setSelectedUser({id, name}) 
    setShowModal(true);
  }
  const handleDeleteConfirm  = () => {
    dispatch(deleteUser(selectedUser.id))
    setSelectedUser({})
    setShowModal(false)
  }
  const handleDeleteCancel = () => {
    setSelectedUser({});
    setShowModal(false);
  }

  return (
    <div>
      <h1>Users</h1>
      { loading 
        ? <Loader />
        : error 
        ? <Message variant='danger' >{ error }</Message>
        : <Table striped bordered hover size="sm" className="table table-hover">
            <thead>
              <tr>
                {['ID', 'NAME', 'EMAIL', 'ADMIN', ''].map(title => (
                  <th scope="col" key={title}>{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>                  
                    { user.is_staff ? <i className="fa-solid fa-thumbs-up" style={{ color: 'blue' }} />
                                    : <i className="fa-regular fa-thumbs-down" />
                    }{'  '}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <LinkContainer to={`/admin/user/${user._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Edit {' '}<i className='fa-solid fa-pen' />
                      </Button>
                    </LinkContainer>

                    <Button className='btn-sm' variant='danger'
                        onClick={() => handleDeleteClick(user._id, user.full_name)}>
                      <i className='fas fa-trash'/>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
            <Modal show={showModal} onHide={handleDeleteCancel}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Delete User</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete this user ({selectedUser && selectedUser.name})?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleDeleteCancel}>Cancel</Button>
                <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
              </Modal.Footer>
            </Modal>
          </Table>
      }
    </div>
  )
}

export default UserListScreen
