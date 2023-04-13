import React from 'react'
import { Form } from "react-bootstrap"

function UserForm({
  firstname, lastname, email,
  setFirstname, setLastname, setEmail
}) {
  return (
    <div>
      <Form.Group controlId='firstname'>
        <Form.Label>First Name</Form.Label>
        <Form.Control required
            type='text' 
            placeholder='Enter First Name' 
            value={ firstname }
            onChange = { (e) => setFirstname(e.target.value) } />
      </Form.Group><br />

      <Form.Group controlId='lastname'>
        <Form.Label>Last Name</Form.Label> 
        <Form.Control required
          type='text' 
          placeholder='Enter Last Name' 
          value={ lastname }
          onChange = { (e) => setLastname(e.target.value) } />
      </Form.Group><br />

      <Form.Group controlId='email'>
        <Form.Label>Email Address</Form.Label>
        <Form.Control required
          type='email' 
          placeholder='Enter Email' 
          value={ email }
          onChange = { (e) => setEmail(e.target.value) } />
      </Form.Group><br />
    </div>
  )
}

export default UserForm
