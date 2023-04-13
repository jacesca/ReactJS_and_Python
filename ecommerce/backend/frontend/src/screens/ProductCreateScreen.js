import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from "react-bootstrap"

import Loader from '../components/Loader'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import ProductForm from '../components/ProductForm'
import { createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'


function ProductCreateScreen() {
  const userLogin = useSelector(state => state.userLogin)
  const { userInfo } = userLogin
  const productCreate = useSelector(state => state.productCreate)
  const { error, loading, success, product:newProduct } = productCreate

  const dispatch = useDispatch()

  let history = useNavigate()

  useEffect(() => {
    if ( !userInfo || !userInfo.is_staff ){
      history('/login')
    } else if (success) {
      dispatch({ type: PRODUCT_CREATE_RESET })
      history(`/admin/product/${newProduct._id}`)
    }
  }, [history, userInfo, success, dispatch, newProduct]) 
  
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState()
  const [countInStock, setCountInStock] = useState()

  const back_url = '/admin/productlist'

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProduct(name, brand, category, description, price, countInStock))
  }

  return (
    <div>
      <Link to={back_url}>Go back</Link>
      <FormContainer>
        <h1>New Product</h1>
        
        { error && <Message variant='danger'>{ error }</Message> }
        { loading && <Loader /> }

        <Form onSubmit={ submitHandler }>
          <ProductForm 
            name={name}
            description={description}
            brand={brand}
            category={category}
            price={price}
            countInStock={countInStock}
            setName={setName}
            setDescription={setDescription}
            setBrand={setBrand}
            setCategory={setCategory}
            setPrice={setPrice}
            setCountInStock={setCountInStock}
          />

          <Button type='submit' variant='primary'>Create</Button>
        </Form>
      </FormContainer>
    </div>
  )
}

export default ProductCreateScreen
