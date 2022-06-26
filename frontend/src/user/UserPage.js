import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { Redirect } from 'react-router-dom'
import { getUserProducts, readUser } from '../admin/apiAdmin'
import Card from '../core/Card'

const UserPage = (props) => {
  const [values, setValues] = useState({
    userProducts: [],
    loadedUser: '',
    error: false,
    loading: true,
  })

  const _id = props.match.params.userId
  const { loadedUser, userProducts, error, loading } = values

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    readUser(props.match.params.userId).then((res) => {
      if (res.error) {
        setValues({ ...values, error: res.error, loading: false })
      } else {
        getUserProducts({ _id }).then((data) => {
          if (data.error) {
            setValues({ ...values, error: data.error, loading: false })
          } else {
            setValues({ ...values, error: false, loading: false, userProducts: data, loadedUser: res })
          }
        })
      }
    })
  }
  const { user } = isAuthenticated()

  const showLoading = () => {
    if (loading) {
      return (
        <div className='alert alert-info'>
          <h3>Loading...</h3>
        </div>
      )
    }
  }

  const showError = () => (
    <div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  )

  const showProducts = () => {
    return (
      <Layout
        className='container-fluid col-md-10 offset-md-1'
        title={`${loadedUser.name}`}
        description={`Typically replies in ${loadedUser.avg_reply_time} mins`}>
        <h2 className='heading-main'>Products from Seller</h2>
        <div className='row'>
          {userProducts.map((p, i) => (
            <Card key={i} product={p} page='Home' />
          ))}
        </div>
      </Layout>
    )
  }

  if (user && props.match.params.userId === user._id) return <Redirect to={`/user/products/${user._id}`} />
  else {
    return (
      <Layout
        className='container-fluid col-md-10 offset-md-1'
        title={`${loadedUser.name}`}
        description={`Typically replies in ${loadedUser.avg_reply_time} mins`}>
        {showError()}
        {showLoading()}
        <h2 className='heading-main'>Products from Seller</h2>
        <div className='row'>
          {userProducts.map((p, i) => (
            <Card key={i} product={p} page='Home' />
          ))}
        </div>
      </Layout>
    )
  }
}

export default UserPage
