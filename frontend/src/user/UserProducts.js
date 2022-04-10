import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { deleteProduct, deleteProducts, getUserProducts, changeProductStatus } from '../admin/apiAdmin'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import BackToDashboard from './BackToDashboard'

const UserProducts = () => {
  const [userProducts, setUserProducts] = useState([])
  const [delProducts, setDelProducts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { user, token } = isAuthenticated()

  const init = () => {
    getUserProducts(user).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setUserProducts(data)
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

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
                  setUserProducts(userProducts.filter((item) => item !== id))
                  confirmAlert({
                    message: 'Product status updated Successfully',
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

  const handleCheckbox = (p) => () => {
    if (delProducts.indexOf(p) === -1) {
      delProducts.push(p)
    } else {
      delProducts.splice(
        delProducts.findIndex(function (i) {
          return p === i
        }),
        1
      )
    }
    //console.log(delProducts)
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

  const showTable = () =>
    userProducts && (
      <table className='table table-hover'>
        <thead>
          <tr>
            <th width='3%'></th>
            <th width='15%'>Name</th>
            <th width='5%'>Price</th>
            <th width='10%'>Category</th>
            <th width='10%'>Last Updated</th>
            <th width='10%'>Status</th>
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
          {userProducts.map((p, i) => (
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
      {BackToDashboard()}
      {showTable()}
    </Layout>
  )
}

export default UserProducts
