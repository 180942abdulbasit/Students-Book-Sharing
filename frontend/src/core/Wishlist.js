import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { getWishlistProducts } from './apiCore'
import Card from './Card'
import Search from './Search'
import { isAuthenticated } from '../auth'

const Wishlist = () => {
  const [products, setProducts] = useState([])
  const [error, setError] = useState(false)

  const { user } = isAuthenticated()

  const loadWishlistProducts = () => {
    getWishlistProducts(user).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setProducts(data)
      }
    })
  }

  useEffect(() => {
    loadWishlistProducts()
  }, [])
  return (
    <Layout className='container-fluid col-md-10 offset-md-1' title='Student Book Sharing' description='Home Page to Student Book Sharing'>
      <h2 className='heading-main'>Wishlist Products</h2>
      <div className='row'>
        {products.map((p, i) => (
          <Card key={i} product={p} page='Home' />
        ))}
      </div>
    </Layout>
  )
}
export default Wishlist
