import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../core/Layout'
import { updateProfile, updateLocalStorage } from '../admin/apiAdmin'
import { readUser } from '../admin/apiAdmin'
import { isAuthenticated } from '../auth'
import BackToDashboard from './BackToDashboard'

const UpdateProfile = () => {
  const [values, setValues] = useState({
    _id: '',
    name: '',
    email: '',
    error: '',
    success: false,
  })
  const { _id, name, email, success, error } = values

  useEffect(() => {
    init()
  }, [])

  const { user, token } = isAuthenticated()

  const init = () => {
    readUser(user._id).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false })
      } else {
        setValues({ ...values, _id: user._id, name: data.name, email: data.email })
      }
    })
  }

  const handleChange = (val) => (event) => {
    setValues({ ...values, error: false, [val]: event.target.value }) // ... = spread operator used to copy an array
  }

  const clickUpdate = (event) => {
    event.preventDefault() //to prevent page relaoding
    setValues({ ...values, error: false })
    updateProfile({ _id: _id, name: name, email: email }, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false })
      } else {
        updateLocalStorage(data, () => {
          setValues({ ...values, name: '', email: '', error: '', success: true })
        })
      }
    })
  }

  const updateForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input onChange={handleChange('name')} type='text' className='form-control' value={name} />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input onChange={handleChange('email')} type='email' className='form-control' value={email} />
      </div>
      <button onClick={clickUpdate} className='btn btn-primary'>
        Update
      </button>
    </form>
  )

  const showError = () => (
    <div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  )

  const showSuccess = () => (
    <div className='alert alert-info' style={{ display: success ? '' : 'none' }}>
      Profile updated successfully.
    </div>
  )

  return (
    <Layout title='Update Profile' description='' className='container col-md-8 offset-md-2'>
      {showSuccess()}
      {showError()}
      {updateForm()}
      {BackToDashboard()}
    </Layout>
  )
}

export default UpdateProfile
