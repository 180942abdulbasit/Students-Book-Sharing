import React, { useState, useEffect, Fragment, useLayoutEffect } from 'react'
import Layout from './Layout'
import { read, listRelated } from './apiCore'
import Card from './Card'
import ShowImage from './ShowImage'
import moment from 'moment'
import { isAuthenticated } from '../auth'
import { confirmAlert } from 'react-confirm-alert'
import { changeProductStatus, deleteProduct } from '../admin/apiAdmin'
import { Link, Redirect } from 'react-router-dom'

const Product = (props) => {
  const [values, setValues] = useState({
    product: undefined,
    relatedProducts: [],
    error: false,
    deleted: false,
  })

  const { product, relatedProducts, error, deleted } = values

  const { user, token } = isAuthenticated()

  const loadSingleProduct = (productId) => {
    read(productId).then((data1) => {
      if (data1.error) {
      } else {
        //
        listRelated(data1._id).then((data2) => {
          if (data2.error) {
          } else {
            setValues({ ...values, product: data1, relatedProducts: data2 })
          }
        })
      }
    })
  }

  useLayoutEffect(() => {
    const productId = props.match.params.productId
    loadSingleProduct(productId)
  }, [props])

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

  const handleDel = (id) => (e) => {
    confirmAlert({
      message: 'Are you sure to chnage status of this product?',
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
                setValues({ ...values })
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

  const showProduct = () => (
    <div className='row'>
      <div className='col-6 py-3 easyzoom easyzoom-overlay'>{product._id && <ShowImage item={product} url='product' size='lg' />}</div>
      <div className='col-6 py-3'>
        <div className='row ml-1 '>
          <h5>{product.status === 1 ? 'Available!' : 'Unavailable!'}</h5>
        </div>
        <hr></hr>
        <div className='row ml-1'>
          <Link to={{ pathname: `/products/by/category/${product.category._id}`, param1: product.category.name }}>
            {product.category && <h6>{product.category.name}</h6>}
          </Link>

          {product.subCategory && (
            <Fragment>
              <h6>&nbsp;&nbsp;/&nbsp;&nbsp;</h6>
              <Link to={{ pathname: `/products/by/subCategory/${product.subCategory._id}`, param1: product.subCategory.name }}>
                {product.subCategory && <h6>{product.subCategory.name}</h6>}
              </Link>
            </Fragment>
          )}
        </div>
        <hr></hr>
        <div>
          <h2>{product.name}</h2>
        </div>
        <div>
          {/* <p>
            Added {moment(product.createdAt).fromNow()}&nbsp;By
            {product.createdBy ? (
              <Link to={`/user/${product.createdBy._id}`} className='text-primary'>{` ${product.createdBy.name}`}</Link>
            ) : (
              ''
            )}
          </p> */}
          <p>
            Added {moment(product.createdAt).fromNow()}&nbsp;By
            <Link to={`/user/userPage/${product.createdBy._id}`} className='text-primary'>
              {user && product.createdBy._id === user._id ? ' You' : ` ${product.createdBy.name}`}
            </Link>
          </p>
        </div>
        <div className='mx-20'>
          <h3>{showProductPrice()}</h3>
          <hr></hr>
        </div>
        <div style={{ minHeight: '' }}>
          <h5>Description:</h5>
          <p>{product.description}</p>
          <hr></hr>
        </div>
        <div className='row ml-1'>
          {product.authors && <h5>Authors:&nbsp; </h5>}
          {product.authors && product.authors.map((a, i) => <p key={i}>{a},&nbsp;</p>)}
        </div>
        <hr></hr>
        <div className='row ml-1'>
          {product.institutes && <h5>Institutes:&nbsp; </h5>}
          {product.institutes && product.institutes.map((a, i) => <p key={i}>{a},&nbsp;</p>)}
        </div>
        <hr></hr>

        {user && user._id !== product.createdBy._id && (
          <div>
            <button style={{ width: '50%', borderRadius: '10px' }} className='btn btn-primary'>
              Chat with Seller
            </button>
          </div>
        )}
        {user && user._id === product.createdBy._id && (
          <div>
            <div>
              <Link to={`/product/update/${product._id}`}>
                <button style={{ width: '50%', borderRadius: '10px' }} className='btn btn-primary'>
                  Update
                </button>
              </Link>
            </div>
            <div>
              <button onClick={handleDel(product._id)} style={{ width: '50%', borderRadius: '10px', marginTop: '10px' }} className='btn btn-danger'>
                {product.status === 1 ? 'Mark as Unavailable' : 'Mark as Available'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const showRelatedProducts = () => (
    <div>
      <div className='my-3'>
        <h2>Related Products</h2>
      </div>

      <div className='row'>
        {relatedProducts.map((p, i) => (
          <Card key={i} product={p} />
        ))}
      </div>
    </div>
  )
  return (
    <Layout className='container-fluid col-md-10 offset-md-1' title={product ? product.name : ''} description=''>
      {product && showProduct()}
      {product && showRelatedProducts()}
      {deleted && <Redirect to={`/user/${user._id}`} />}
    </Layout>
  )
}

export default Product
