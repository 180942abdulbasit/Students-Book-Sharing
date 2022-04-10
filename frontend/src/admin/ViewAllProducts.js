import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { changeProductStatus, deleteProduct, deleteProducts, loadAllProducts } from '../admin/apiAdmin'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import BackToDashboard from '../user/BackToDashboard'

const ViewAllProducts = () => {
  const [products, setProducts] = useState([])
  const [delProducts, setDelProducts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { user, token } = isAuthenticated()

  const init = () => {
    loadAllProducts().then((data) => {
      if (data.error) {
        setError(data.error)
        setLoading(false)
      } else {
        setProducts(data)
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  const showLoading = () => {
    if (loading) {
      return (
        <div className='alert alert-info'>
          <h3>Loading...</h3>
        </div>
      )
    }
  }

  const handleDel = (id) => (e) => {
    setError('')
    id && delProducts.indexOf(id) === -1 && delProducts.push(id)
    if (delProducts.length > 0) {
      confirmAlert({
        message: 'Are you sure to change status of this product?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              changeProductStatus(user._id, token, id).then((data) => {
                if (data.error) {
                  setError(data.error)
                } else {
                  setError('')
                  setProducts(products.filter((item) => item !== id))
                  confirmAlert({
                    message: 'Product status changed Successfully',
                    buttons: [{ label: 'OK' }],
                  })
                }
              })
            },
          },
          {
            label: 'No',
            onClick: () => {
              id && setDelProducts([])
            },
          },
        ],
      })
    }
  }

  const showError = () => (
    <div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  )

  const showTable = () =>
    products && (
      <table className='table table-hover'>
        <thead>
          <tr>
            <th width='3%'></th>
            <th width='20%'>Name</th>
            <th width='5%'>Price</th>
            <th width='10%'>Category</th>
            <th width='10%'>Last Updated</th>
            <th width='10%'>Status</th>
            <th width='10%'>Created By</th>
            <th width='5%'></th>
            <th width='5%'>
              {/* <button
                className='btn btn-danger btn-sm mb-1'
                onClick={handleDel()}
              >
                Delete Selected
              </button> */}
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr id={i}>
              {/* <td>
                <input type='checkbox' onChange={handleCheckbox(p._id)} />
              </td> */}
              <td></td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.category.name}</td>
              <td>{moment(p.updatedAt).fromNow()}</td>
              <td>{p.status === 1 ? 'Available' : 'Not Available'}</td>
              <td>{p.createdBy._id === user._id ? ' You' : ` ${p.createdBy.name}`}</td>
              <td>
                <Link to={`/product/${p._id}`}>
                  <button className='btn btn-primary btn-sm mb-1'>View Product</button>
                </Link>
              </td>
              <td>
                <button className='btn btn-danger btn-sm mb-1' onClick={handleDel(p._id)}>
                  {p.status === 1 ? 'Mark as Unavailable' : 'Mark as Available'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  return (
    <Layout
      title='User Products'
      description={`Hello ${user.name}!`}
      // className='container col-md-8 offset-md-2'
      className='container'>
      {showError()}
      {showLoading()}
      {showTable()}
      {BackToDashboard()}
    </Layout>
  )
}
export default ViewAllProducts
