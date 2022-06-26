import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'
import ShowImage from './ShowImage'
import { confirmAlert } from 'react-confirm-alert'
import { changeProductStatus, deleteProduct } from '../admin/apiAdmin'
import { toggleWishlist, checkWishlist } from './apiCore'
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBTooltip, MDBCardFooter, MDBBtn, MDBIcon } from 'mdbreact'
import '../styles.css'
import 'font-awesome/css/font-awesome.min.css'
import ReactStars from 'react-rating-stars-component'

const Card = ({ product, page }) => {
  const { user, token } = isAuthenticated()
  const [data, setData] = useState({
    color: '#d1d1d1',
    inWishlist: false,
  })

  const { color, inWishlist } = data

  useEffect(() => {
    if (user)
      checkWishlist(user, product._id).then((data) => {
        if (data.error) {
          console.log(data.error)
        } else {
          if (data.message === 'no') {
            setData({ ...data, inWishlist: false, color: '#d1d1d1' })
          }
          if (data.message === 'yes') {
            setData({ ...data, inWishlist: true, color: '#ff2323' })
          }
        }
      })
  }, [])

  const changeColor = (val) => (e) => {
    if (val === 'enter') e.target.style.color = '#ff2323'
    if (val === 'leave') e.target.style.color = color
  }
  const ratingChanged = (rating) => {
    console.log(rating)
  }
  const handleHeartClick = () => (e) => {
    toggleWishlist(user, product._id).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        if (data.message === 'added') {
          setData({ ...data, color: '#ff2323' })
        }
        if (data.message === 'removed') {
          setData({ ...data, color: '#d1d1d1' })
        }
      }
    })
  }
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
    <div className='product-card'>
      <div className='product-tumb'>
        <ShowImage item={product} size='home' url='product' />
      </div>
      <div className='product-details'>
        <span className='product-catagory'>{product.category?.name}</span>
        <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
          <h4 className='card-name'>
            <a href=''>{product.name.length > 15 ? `${product.name.substring(0, 12)}...` : `${product.name}`}</a>
          </h4>
          <div className='row'>
            <ReactStars
              classNames={'col'}
              count={5}
              onChange={ratingChanged}
              size={23}
              value={product.averageRating}
              edit={false}
              isHalf={true}
              emptyIcon={<i class='fa-regular fa-star'></i>}
              halfIcon={<i class='fa-solid fa-star-half-stroke'></i>}
              fullIcon={<i class='fa-solid fa-star'></i>}
              activeColor='#222'
            />
            <div className='col rating-count'>({product.numOfReviews})</div>
          </div>
        </Link>
        <div className='product-bottom-details'>
          <div className='product-price'>{product.price > 0 ? `Rs. ${product.price}` : 'Free'}</div>
          <div className='product-links' style={{ visibility: user === undefined ? 'hidden' : '' }}>
            <i
              className='fa fa-heart fa-lg mr-1'
              style={{ color: inWishlist ? '#ff2323' : '#d1d1d1' }}
              onMouseEnter={changeColor('enter')}
              onMouseLeave={changeColor('leave')}
              onClick={handleHeartClick()}></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
