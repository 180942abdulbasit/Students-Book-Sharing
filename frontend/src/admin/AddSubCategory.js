import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import { createSubCategory, getCategories } from './apiAdmin'
import BackToDashboard from '../user/BackToDashboard'

const AddSubCategory = () => {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const { user, token } = isAuthenticated()
  const handleChange = (name) => (e) => {
    setError('')
    setSuccess(false)
    if (name == 'name') {
      setName(e.target.value)
    }
    if (name == 'category') {
      setCategory(e.target.value)
    }
  }
  const clickSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    createSubCategory(user._id, token, { name, category }).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setError('')
        setSuccess(true)
      }
    })
  }
  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        //setValues({ ...values, error: data.error })
        setError(data.error)
      } else {
        //setValues({ ...values, categories: data })
        setCategories(data)
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  const newSubCategoryForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input type='text' className='form-control' onChange={handleChange('name')} value={name} autoFocus required />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Category</label>
        <select onChange={handleChange('category')} className='form-control'>
          <option>Please Select</option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>{' '}
      </div>
      <button type='submit' className='btn btn-primary' onClick={clickSubmit}>
        Create Sub Category
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
  const goBack = () => (
    <div className='mt-5'>
      <Link to='/admin/dashboard' className='text-warning'>
        Back to Dashboard
      </Link>
    </div>
  )
  return (
    <Layout title='Add a new SubCategory' description={`Hello ${user.name}!`} className='container-fluid'>
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showSuccess()}
          {showError()}
          {newSubCategoryForm()}
          {BackToDashboard()}
        </div>
      </div>
    </Layout>
  )
}

export default AddSubCategory
