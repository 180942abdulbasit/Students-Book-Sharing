import React, { useState } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import { createCategory } from './apiAdmin'
import BackToDashboard from '../user/BackToDashboard'

const AddCategory = () => {
  const [name, setName] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const { user, token } = isAuthenticated()
  const handleChange = (e) => {
    setError('')
    setName(e.target.value)
    //
    setSuccess(false)
  }
  const clickSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    createCategory(user._id, token, { name }).then((data) => {
      if (data.error) {
        //setError(true)
        setError(data.error)
      } else {
        setError('')
        setSuccess(true)
      }
    })
  }
  const newCategoryForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input type='text' className='form-control' onChange={handleChange} value={name} autoFocus required />
      </div>
      <button type='submit' className='btn btn-primary' onClick={clickSubmit}>
        Create Category
      </button>
    </form>
  )
  const showSuccess = () => {
    if (success) {
      return <h3 className='text-success'>{name} is created.</h3>
    }
  }
  const showError = () => {
    if (error) {
      //return <h3 className='text-danger'>{name} already exists</h3>
      return <h3 className='text-danger'>{error}</h3>
    }
  }

  return (
    <Layout title='Add a new Category' description={`Hello ${user.name}!`} className='container-fluid'>
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showSuccess()}
          {showError()}
          {newCategoryForm()}
          {BackToDashboard()}
        </div>
      </div>
    </Layout>
  )
}

export default AddCategory
