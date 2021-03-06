import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { getProductsByCategory } from './apiCore'
import Card from './Card'

const CategoryProducts = (props) => {
  const [values, setValues] = useState({
    products: [],
    error: false,
    loading: true,
  })

  const { products, error, loading } = values
  const categoryId = props.match.params.category

  const loadProductsByCategory = () => {
    getProductsByCategory(categoryId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false })
      } else {
        setValues({ ...values, products: data, loading: false, error: false })
      }
    })
  }

  useEffect(() => {
    loadProductsByCategory()
  }, [props])
  return (
    <Layout className='container-fluid col-md-10 offset-md-1' title='Student Book Sharing' description='Home Page to Student Book Sharing'>
      <h2 className='heading-main'>{props.location.param1}</h2>
      <div className='row'>{products && products.map((p, i) => <Card key={i} product={p} page='Home' />)}</div>
    </Layout>
  )
}
export default CategoryProducts
