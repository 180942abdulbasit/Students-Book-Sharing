import React, { useEffect, useState, useLayoutEffect } from 'react'
import { getUserProducts, readUser } from '../admin/apiAdmin'
import Layout from '../core/Layout'
import Card from '../core/Card'

const MyProductsView = (props) => {
  const [values, setValues] = useState({
    user: {},
    name: '',
    email: '',
    id: '',
    role: -1,
    userProucts: [],
    error: false,
    success: false,
    loading: true,
  })

  const { user, name, email, role, id, userProucts, loading, error, success } = values
  useEffect(() => {
    init()
  }, [props])

  const init = () => {
    readUser(props.match.params.userId).then((res) => {
      if (res.error) {
        setValues({ ...values, success: false, error: res.error, loading: false })
      } else {
        getUserProducts(res).then((data) => {
          if (data.error) {
            setValues({
              ...values,
              success: false,
              error: data.error,
              loading: false,
            })
          } else {
            setValues({
              ...values,
              name: res.name,
              email: res.email,
              role: res.role,
              userProucts: data,
              error: false,
              success: true,
              loading: false,
            })
          }
        })
      }
    })
  }

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

  const showCards = () => (
    <div>
      <h2 className='heading-main'>My Products</h2>
      <div className='row'>
        {userProucts.map((p, i) => (
          <Card key={i} product={p} page='MyProductsView' />
        ))}
      </div>
    </div>
  )

  return (
    <Layout title={`${name}`} description='' className='container'>
      {showError()}
      {showLoading()}
      {showCards()}
    </Layout>
  )
}

export default MyProductsView
