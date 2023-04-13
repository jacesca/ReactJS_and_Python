import React from 'react'
import { Form } from "react-bootstrap"


function ProductForm({ 
  name, description, brand, category, price, countInStock,
  setName, setDescription, setBrand, setCategory, setPrice, setCountInStock
}) {
  return (
    <div>
      <Form.Group controlId='name'>
        <Form.Label>Name</Form.Label>
        <Form.Control required
            type='text' 
            placeholder='Enter Name' 
            value={ name }
            onChange = { (e) => setName(e.target.value) } />
      </Form.Group><br />

      <Form.Group controlId='description'>
        <Form.Label>Description</Form.Label>
        <Form.Control required
            type='text' 
            placeholder='Enter Description' 
            value={ description }
            onChange = { (e) => setDescription(e.target.value) } />
      </Form.Group><br />

      <Form.Group controlId='brand'>
        <Form.Label>Brand</Form.Label>
        <Form.Control required
          type='text' 
          placeholder='Enter Brand' 
          value={ brand }
          onChange = { (e) => setBrand(e.target.value) } />
      </Form.Group><br />

      <Form.Group controlId='category'>
        <Form.Label>Category</Form.Label>
        <Form.Control required
          type='text' 
          placeholder='Enter Category' 
          value={ category }
          onChange = { (e) => setCategory(e.target.value) } />
      </Form.Group><br />

      <Form.Group controlId='price'>
        <Form.Label>Price ($)</Form.Label>
        <Form.Control required
          type='number' 
          placeholder='Enter Price' 
          value={ price }
          pattern="[0-9]+([.,][0-9]+)?"
          min={ 0 }
          step='0.01'
          onChange = { (e) => setPrice(e.target.value) } />
      </Form.Group><br />

      <Form.Group controlId='countInStock'>
        <Form.Label>countInStock</Form.Label>
        <Form.Control required
          type='number' 
          placeholder='Enter Count In Stock' 
          value={ countInStock }
          min={ 0 }
          onChange = { (e) => setCountInStock(e.target.value) } />
      </Form.Group><br />
    </div>
  )
}

export default ProductForm
