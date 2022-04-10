import React from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import ShowImage from './ShowImage'
import { confirmAlert } from 'react-confirm-alert'
import { changeProductStatus, deleteProduct } from '../admin/apiAdmin'

const Card = ({ product, page }) => {
  const { user, token } = isAuthenticated()

  const handleDel = (id) => (e) => {
    confirmAlert({
      message: 'Are you sure to change status of this product?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            changeProductStatus(user._id, token, product._id).then((data) => {
              if (data.error) {
                confirmAlert({
                  message: data.error,
                  buttons: [{ label: 'OK' }],
                })
              } else {
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
          onClick: () => {},
        },
      ],
    })
  }

  const showProductPrice = () => {
    if (product.price > 0) {
      return (
        <p className='card-text' style={{ color: 'green' }}>
          Rs. {product.price}
        </p>
      )
    } else {
      return (
        <p className='card-text' style={{ color: 'green' }}>
          FREE
        </p>
      )
    }
  }
  return (
    <div className='col-lg-2 col-md-3 col-sm-4 col-xs-12 mb-3'>
      <div
        style={{
          borderRadius: '15px',
          borderStyle: 'solid',
          borderWidth: '3px',
        }}
        className='card'>
        <ShowImage item={product} url='product' />
        <div className='card-body' style={{ padding: 10 }}>
          <h5
            className='card-title'
            style={{
              width: '100%',
            }}>
            {product.name}
          </h5>
          {showProductPrice()}
          <Link to={`/product/${product._id}`}>
            <button style={{ width: '100%', borderRadius: '10px' }} className='btn btn-primary mb-1'>
              View Product
            </button>
          </Link>
          {user && user._id !== product.createdBy && (
            <button style={{ width: '100%', borderRadius: '10px' }} className='btn btn-primary'>
              Chat with Seller
            </button>
          )}

          {page === 'MyProductsView' && user._id === product.createdBy && (
            <button style={{ width: '100%', borderRadius: '10px', paddingLeft: '5%' }} className='btn btn-danger' onClick={handleDel(product._id)}>
              {product.status === 1 ? 'Mark Unavailable' : 'Mark Available'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Card
