import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { Form, Button } from "react-bootstrap"

import Loader from '../components/Loader'
import Message from '../components/Message'
import ProductForm from '../components/ProductForm'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct, uploadProductImage } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET, PRODUCT_IMAGE_UPLOAD_RESET } from '../constants/productConstants'


function ProductEditScreen() {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [countInStock, setCountInStock] = useState(0)
  const [image, setImage] = useState('')
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  const back_url = '/admin/productlist'

  let {id:productId} = useParams()
  let history = useNavigate()

  const productDetails = useSelector(state => state.productDetails)
  const { error, loading, product } = productDetails
  const productUpdate = useSelector(state => state.productUpdate)
  const { error:errorUpdate, loading:loadingUpdate, success:successUpdate } = productUpdate
  const productImageUpload = useSelector(state => state.productImageUpload)
  const { image:newImage } = productImageUpload

  useEffect(() => {
    if(successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      history(back_url)
    } else if (!product.name || product._id !== Number(productId )) {
      dispatch({ type: PRODUCT_IMAGE_UPLOAD_RESET })
      dispatch(listProductDetails(productId))
    } else {
      setName(product.name)
      setBrand(product.brand)
      setCategory(product.category)
      setDescription(product.description)
      setPrice(product.price)
      setCountInStock(product.countInStock)
      setImage(newImage ? newImage.url : product.image)
    }
  }, [product, productId, dispatch, history, successUpdate, newImage ])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateProduct({
      _id: product._id,
      name: name,
      brand: brand, 
      category: category,
      description: description,
      price: price,
      countInStock: countInStock,
    }))
  }

  const uploadFileHandler = async (e) => {
    // console.log(e.target.files)
    setUploading(true)
    const file = e.target.files[0]
    dispatch(uploadProductImage(file, productId))
    setUploading(false)
  }

  return (
    <div>
      <Link to={back_url}>Go back</Link>
      
      <FormContainer>
        <h1>Edit Product</h1>

        { loadingUpdate && <Loader /> }
        { errorUpdate && <Message variant='danger'>{ errorUpdate }</Message> }
        
        { loading 
          ? <Loader />
          : error ? <Message variant='danger'>{ error }</Message> 
          : 
            <Form onSubmit={ submitHandler }>
              <Form.Group>
                <Form.Label>Image</Form.Label>
                <Form.Control style={{ width: '50%' }}
                  type='Image'
                  src={ image }
                />
                {/* <Form.Control
                  readOnly
                  type='text' 
                  placeholder='Enter Image' 
                  value={ image }
                  onChange = { (e) => setImage(e.target.value) } /> */}
                <Form.Control
                  type='file' 
                  id='image-file'
                  onChange={(e) => uploadFileHandler(e)} />
                { uploading && <Loader /> }
              </Form.Group><br />

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

              <Button type='submit' variant='primary'>Update</Button>
            </Form>
        }
      </FormContainer> 
    </div>
  )
}

export default ProductEditScreen
