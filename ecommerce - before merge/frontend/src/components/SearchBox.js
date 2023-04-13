import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function SearchBox() {
  const [search, setSearch] = useState('')

  let navigate = useNavigate()
  
  const submitHandler = (e) => {
    e.preventDefault()
    navigate(`/?search=${search}`) //&page=1
    // console.log(window.location.href);
    // console.log(window.location.pathname);
    // console.log(window.location.protocol);
    // console.log(window.location.hostname);
  }

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='search'
        placeholder='Search'
        name='q'
        onChange={(e) => setSearch(e.target.value)}
        className='mr-sm-2 ml-sm-5'
        aria-label='Search'
      />
      <Button
        type='Submit'
        variant='outline-success'
        className='p-2'
      >Search</Button>
    </Form>
  )
}

export default SearchBox
