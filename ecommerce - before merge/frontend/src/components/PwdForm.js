import React from 'react'
import { Form } from "react-bootstrap"

function PwdForm({
  password, confirmPassword,
  setPassword, setConfirmPassword
}) {
  return (
    <div>
      <Form.Group controlId='password'>
        <Form.Label>Password</Form.Label>
        <Form.Control required
          type='password' 
          placeholder='Enter Password' 
          value={ password }
          onChange = { (e) => setPassword(e.target.value) } />
      </Form.Group><br />

      <Form.Group controlId='confirmPassword'>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control required
          type='password' 
          placeholder='Confirm Password' 
          value={ confirmPassword }
          onChange = { (e) => setConfirmPassword(e.target.value) } />
      </Form.Group><br />      
    </div>
  )
}

export default PwdForm
