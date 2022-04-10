import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import Layout from '../core/Layout'
import { signin, authenticate, isAuthenticated } from '../auth'

const Signin = () => {
  const [values, setValues] = useState({
    email: 'basit@gmail.com',
    password: 'basit123',
    // email: '',
    // password: '',
    error: '',
    loading: false,
    redirectToReferrer: false,
  })
  const { email, password, loading, error, redirectToReferrer } = values
  const { user } = isAuthenticated()

  const handleChange = (val) => (event) => {
    setValues({ ...values, error: false, [val]: event.target.value }) // ... = spread operator used to copy an array
  }

  const clickSubmit = (event) => {
    event.preventDefault() //to prevent page relaoding
    setValues({ ...values, error: false, loading: true })
    if (email && password) {
      signin({ email: email, password: password }).then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false })
        } else {
          authenticate(data, () => {
            setValues({ ...values, redirectToReferrer: true })
          })
        }
      })
    } else {
      if (!email) {
        setValues({ ...values, error: 'Enter Email', loading: false })
      } else {
        setValues({ ...values, error: 'Enter Password', loading: false })
      }
    }
  }

  const signUpForm = () => (
    <form>
      <div className='form-group'>
        <label className='text-muted'>Email</label>
        <input onChange={handleChange('email')} type='email' className='form-control' value={email} required />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Password</label>
        <input onChange={handleChange('password')} type='password' className='form-control' value={password} required />
      </div>
      <button onClick={clickSubmit} className='btn btn-primary'>
        Submit
      </button>
    </form>
  )

  const showError = () => (
    <div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  )

  const showLoading = () => {
    if (loading) {
      return (
        <div className='alert alert-info'>
          <h2>Loading...</h2>
        </div>
      )
    }
  }

  const redirectUser = () => {
    console.log(user)
    if (redirectToReferrer) {
      if (user && user.role === 1) {
        return <Redirect to='/admin/dashboard' />
      }
      // else {
      //   return <Redirect to='/user/dashboard' />
      // }
      if (user && user.role === 0) {
        return <Redirect to='/user/dashboard' />
      }
    }
    if (isAuthenticated()) {
      return <Redirect to='' />
    }
  }
  return (
    <Layout title='Signin' description='Signin to Student Book Sharing' className='container col-md-8 offset-md-2'>
      {showLoading()}
      {showError()}
      {signUpForm()}
      {redirectUser()}
    </Layout>
  )
}

export default Signin
