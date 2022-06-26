import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../core/Layout'
import { changePassword, updateLocalStorage } from '../admin/apiAdmin'
import { readUser } from '../admin/apiAdmin'
import { isAuthenticated } from '../auth'
import BackToDashboard from './BackToDashboard'

const ChangePassword = () => {
  const [values, setValues] = useState({
    oldPassword: '',
    newPassword: '',
    error: '',
    success: false,
  })

  const { oldPassword, newPassword, success, error } = values

  const { user, token } = isAuthenticated()

  const handleChange = (val) => (event) => {
    setValues({ ...values, error: false, [val]: event.target.value }) // ... = spread operator used to copy an array
  }

  const clickChange = (event) => {
    event.preventDefault() //to prevent page relaoding
    setValues({ ...values, error: false })
    changePassword({ _id: user._id, oldPassword: oldPassword, newPassword: newPassword }, token).then((data) => {
      if (data.error) {
        setValues({ ...values, oldPassword: '', newPassword: '', error: data.error, success: false })
      } else {
        setValues({ ...values, oldPassword: '', newPassword: '', error: '', success: true })
      }
    })
  }

  const Form = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Old Password</label>
        <input onChange={handleChange('oldPassword')} type='password' className='form-control' value={oldPassword} />
      </div>
      <div className='form-group'>
        <label className='text-muted'>New Password</label>
        <input onChange={handleChange('newPassword')} type='password' className='form-control' value={newPassword} />
      </div>
      <button onClick={clickChange} className='btn btn-primary'>
        Change Password
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
      Password changed successfully.
    </div>
  )

  return (
    <Layout title='Update Profile' description='' className='container col-md-8 offset-md-2'>
      {showSuccess()}
      {showError()}
      {Form()}
      {BackToDashboard()}
    </Layout>
  )
}

export default ChangePassword
