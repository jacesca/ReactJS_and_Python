import React, { useEffect } from 'react' //useState
import { useNavigate } from "react-router-dom"
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button } from "react-bootstrap" //Modal

import Loader from '../components/Loader'
import Message from '../components/Message'
import { getOrderList } from '../actions/orderActions' 


function OrderListScreen() {
  const dispatch = useDispatch()
  const orderList = useSelector(state => state.orderList)
  const { loading, error, orders } = orderList
  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin
  // const userDelete = useSelector(state => state.userDelete)
  // const { success:successDelete } = userDelete
  // const [showModal, setShowModal] = useState(false);
  // const [selectedUser, setSelectedUser] = useState({});

  let history = useNavigate()

  useEffect(() => {
    if ( userInfo && userInfo.is_staff ){
      dispatch(getOrderList())
    } else {
      history('/login')
    }
  }, [dispatch, history, userInfo ]) //successDelete

  // const handleDeleteClick = (id, name) => { 
  //   setSelectedUser({id, name}) 
  //   setShowModal(true);
  // }
  // const handleDeleteConfirm  = () => {
  //   dispatch(deleteUser(selectedUser.id))
  //   setSelectedUser({})
  //   setShowModal(false)
  // }
  // const handleDeleteCancel = () => {
  //   setSelectedUser({});
  //   setShowModal(false);
  // }

  return (
    <div>
      <h1>Orders</h1>
      { loading 
        ? <Loader />
        : error 
        ? <Message variant='danger' >{ error }</Message>
        : <Table striped bordered hover size="sm" className="table table-hover">
            <thead>
              <tr>
                {['ID', 'USER', 'DATE', 'TOTAL', 'PAID', 'DELIVERED', ''].map(title => (
                  <th scope="col" key={title}>{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.username}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td style={{ textAlign: 'right' }}>
                    ${order.totalPrice.toLocaleString("en-US", {style:"currency", currency:"USD"})}
                  </td>
                  <td>                  
                    { order.isPaid ? <i className="fa-solid fa-clipboard-check" />
                                   : <i className='fa-solid fa-hourglass-half' style={{ color: 'red' }} />
                    }{'  '}
                    { order.paidAt && order.paidAt.substring(0, 10) } 
                  </td>
                  <td>
                    { order.isPaid && (
                      order.isDelivered ? <i className="fa-solid fa-house-circle-check"></i>
                                        : <i className='fa-solid fa-truck-fast' style={{ color: 'red' }} />
                    )}{'  '}
                    { order.deliveredAt && order.deliveredAt.substring(0, 10) }
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className='btn-sm' variant='light'>
                        Details {' '}<i className='fa-solid fa-pen' />
                      </Button>
                    </LinkContainer>

                    {/* <Button className='btn-sm' variant='danger'
                        onClick={() => handleDeleteClick(user._id, user.full_name)}>
                      <i className='fas fa-trash'/>
                    </Button> */}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* <Modal show={showModal} onHide={handleDeleteCancel}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Delete User</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete this user ({selectedUser && selectedUser.name})?</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleDeleteCancel}>Cancel</Button>
                <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
              </Modal.Footer>
            </Modal> */}
          </Table>
      }
    </div>
  )
}

export default OrderListScreen
