import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { getProductsBySubCategory } from './apiCore'
import Card from './Card'

const SubCategoryProducts = (props) => {
  const [values, setValues] = useState({
    products: [],
    error: false,
    loading: true,
  })

  const { products, error, loading } = values
  const subCategoryId = props.match.params.subCategory

  const loadProductsBySubCategory = () => {
    getProductsBySubCategory(subCategoryId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false })
      } else {
        setValues({ ...values, products: data, loading: false, error: false })
      }
    })
  }

  useEffect(() => {
    loadProductsBySubCategory()
  }, [props])
  return (
    <Layout className='container-fluid' title='Student Book Sharing' description='Home Page to Student Book Sharing'>
      <h2 className='heading-main'>{props.location.param1}</h2>
      <div className='row'>{products && products.map((p, i) => <Card key={i} product={p} page='Home' />)}</div>
    </Layout>
  )
}
export default SubCategoryProducts
