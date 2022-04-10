import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Link } from 'react-router-dom'
import { updateCategory, getCategories } from './apiAdmin'
import BackToDashboard from '../user/BackToDashboard'

const UpdateCategory = () => {
  const [name, setName] = useState('')
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  const { user, token } = isAuthenticated()

  const handleChange = (type) => (e) => {
    if (type === 'category') {
      setError('')
      setCategoryId(e.target.value)
      setSuccess(false)
    }
    if (type === 'name') {
      setError('')
      setName(e.target.value)
      setSuccess(false)
    }
  }

  const clickSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    updateCategory(user._id, token, categoryId, { name }).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setError('')
        setSuccess(true)
        setName('')
        setCategoryId('')
      }
    })
  }

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setCategories(data)
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  const updateCategoryForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Category</label>
        <select onChange={handleChange('category')} className='form-control' defaultValue='null'>
          <option value='null' disabled>
            --Select--
          </option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
      {categoryId && (
        <div className='form-group'>
          <label className='text-muted'>Enter new Name</label>
          <input onChange={handleChange('name')} type='text' className='form-control' value={name} />
        </div>
      )}
      <button type='submit' className='btn btn-primary' onClick={clickSubmit}>
        Update
      </button>
    </form>
  )

  const showSuccess = () => {
    if (success) {
      return <h3 className='text-success'>Success</h3>
    }
  }
  const showError = () => {
    if (error) {
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
    <Layout title='Update a Category' description={`Hello ${user.name}!`} className='container-fluid'>
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showSuccess()}
          {showError()}
          {updateCategoryForm()}
          {BackToDashboard()}
        </div>
      </div>
    </Layout>
  )
}

export default UpdateCategory
