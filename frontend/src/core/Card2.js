import React from 'react'
import { Link } from 'react-router-dom'
import ShowImage from './ShowImage'
import ShowImage2 from './ShowImage2'

const Card2 = ({ product }) => {
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
    <div
      className='card col-lg-2 col-md-3 col-sm-4 col-xs-12 mb-3'
      style={{
        borderRadius: '15px',
        borderStyle: 'solid',
        borderWidth: '2px',
        padding: '0px',
      }}
    >
      <div
        style={{
          minHeight: '50%',
          maxHeight: '50%',
          width: '100%',
          backgroundColor: 'red',
        }}
      >
        <ShowImage2 item={product} url='product' />
      </div>

      <div className='card-body' style={{ height: '50%', backgroundColor: '' }}>
        <div
          style={{
            backgroundColor: '',
            height: '38%',
            overflow: 'hidden',
          }}
        >
          <h5 className='card-title'>{product.name}</h5>
        </div>
        <p className='card-text'>{showProductPrice()}</p>
        <Link to={`/product/${product._id}`}>
          <button
            style={{ width: '100%', borderRadius: '10px' }}
            className='btn btn-primary mb-1'
          >
            View Product
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Card2
