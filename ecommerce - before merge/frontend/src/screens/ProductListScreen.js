import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Modal, Row, Col } from "react-bootstrap"

import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions' 
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

function ProductListScreen() {
  const dispatch = useDispatch()
  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin
  const productList = useSelector(state => state.productList)
  const { error, loading, products, page, totalPages } = productList
  const productCreate = useSelector(state => state.productCreate)
  const { loading:loadingCreate, error:errorCreate, success:successCreate, product:newProduct } = productCreate
  const productDelete = useSelector(state => state.productDelete)
  const { loading:loadingDelete, error: errorDelete, success:successDelete } = productDelete
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});

  // const {productId} = useParams();
  let history = useNavigate()
  let keywords = window.location.search

  useEffect(() => {
    if (!userInfo.is_staff ){
      history('/login')
    } else if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET })
      history(`/admin/product/${newProduct._id}`)
    } else {
      dispatch(listProducts(keywords))
    }
  }, [dispatch, history, userInfo, successDelete, newProduct, successCreate, keywords]) 

  const handleDeleteClick = (id, name) => { 
    setSelectedProduct({id, name}) 
    setShowModal(true);
  }
  const handleDeleteConfirm  = () => {
    dispatch(deleteProduct(selectedProduct.id))
    setSelectedProduct({})
    setShowModal(false)
  }
  const handleDeleteCancel = () => {
    setSelectedProduct({});
    setShowModal(false);
  }

  const createProductHandler = () => {
    dispatch(createProduct())
  }


  return (
    <div>
      <Row>
        <Col md={9}>
          <h1>Products</h1>
        </Col>
        <Col md={3} style={{ textAlign: 'right' }}>
          {/* <LinkContainer to='/admin/product/create'>
            <Button className='my-3'>
              <i className='fas fa-plus'/> Create Product
            </Button>
          </LinkContainer> */}
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'/> Create Product
          </Button>

        </Col>
      </Row>

      { loadingDelete && <Loader /> }
      { errorDelete && <Message variant='danger' >{ errorDelete }</Message> }

      { loadingCreate && <Loader /> }
      { errorCreate && <Message variant='danger' >{ errorCreate }</Message> }

      <Row>
        <Col md={12}>
          { loading 
            ? <Loader />
            : error 
            ? <Message variant='danger' >{ error }</Message>
            : <div>
                <Table striped bordered hover size="sm" className="table table-hover">
                  <thead>
                    <tr>
                      {['ID', 'NAME', 'BRAND', 'CATEGORY', 'PRICE', 'STOCK', ''].map(title => (
                        <th scope="col" key={title}>{title}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>{product._id}</td>
                        <td>{product.name}</td>
                        <td>{product.brand}</td>
                        <td>{product.category}</td>
                        <td><Row className='justify-content-end'>$ {product.price}</Row></td>
                        <td><Row className='justify-content-end'>{product.countInStock}</Row></td>
                        <td style={{ textAlign: 'right' }}>
                          <LinkContainer to={`/admin/product/${product._id}`}>
                            <Button className='btn-sm' variant='light'>
                              Edit {' '}<i className='fa-solid fa-pen' />
                            </Button>
                          </LinkContainer>

                          <Button className='btn-sm' variant='danger'
                            onClick={() => handleDeleteClick(product._id, product.name)}>
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
                    <Modal.Body>Are you sure you want to delete this product No. {selectedProduct && selectedProduct.id} ({selectedProduct && selectedProduct.name})?</Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleDeleteCancel}>Cancel</Button>
                      <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
                    </Modal.Footer>
                  </Modal>
                </Table>
                <Paginate page={page?page:1} pages={totalPages} isAdmin={true} />
              </div>
          }
        </Col>
      </Row>
    </div>
  )
}

export default ProductListScreen
