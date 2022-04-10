import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { getProducts } from './apiCore'
import Card from './Card'
import Card2 from './Card2'
import Search from './Search'

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([])
  const [productsByArrival, setProductsByArrival] = useState([])
  const [error, setError] = useState(false)

  const loadProductBySell = () => {
    getProducts('sold').then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setProductsBySell(data)
      }
    })
  }
  const loadProductByArrival = () => {
    getProducts('createdAt').then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setProductsByArrival(data)
      }
    })
  }
  useEffect(() => {
    loadProductByArrival()
    loadProductBySell()
  }, [])
  return (
    <Layout className='container-fluid col-md-10 offset-md-1' title='Student Book Sharing' description='Home Page to Student Book Sharing'>
      <Search />
      <h2 className='mb-4'>New Arrivals</h2>
      <div className='row'>
        {productsByArrival.map((p, i) => (
          <Card key={i} product={p} page='Home' />
        ))}
      </div>
      <h2 className='mb-4'>Popular Books</h2>
      <div className='row'>
        {productsBySell.map((p, i) => (
          <Card key={i} product={p} page='Home' />
        ))}
      </div>
    </Layout>
  )
}
export default Home
