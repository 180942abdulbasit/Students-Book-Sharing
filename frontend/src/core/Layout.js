import React, { useState, useEffect } from 'react'
import Menu from './Menu'
import { getCategories } from './apiCore'
import { getSubCategories } from '../admin/apiAdmin'
import '../styles.css'
import { Link } from 'react-router-dom'
import { NavDropdown } from 'react-bootstrap'

const Layout = ({ title = 'Title', description = 'Description', className, children }) => {
  const [data, setData] = useState({
    categories: [],
    error: 'false',
    subCategories: [],
    showDropDown: false,
  })

  const { categories, error, subCategories, showDropDown } = data

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setData({ ...data, error: data.error })
      } else {
        setData({ ...data, categories: data })
      }
    })
  }

  const loadSubCategories = (categoryId) => {
    getSubCategories(categoryId).then((res) => {
      if (res.error) {
        setData({ ...data, error: res.error })
      } else {
        setData({ ...data, subCategories: res })
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  const handleMouse = (value, categoryId) => (event) => {
    if (value === 'enter') {
      loadSubCategories(categoryId)
      //console.log(subCategories)
      setData({ ...data, showDropDown: true })
    }
    if (value === 'leave') {
      setData({ ...data, showDropDown: false })
    }
  }

  return (
    // <div>
    //   <Menu />
    //   <div className='jumbotron' style={{ borderRadius: '20px' }}>
    //     <h2>{title}</h2>
    //     <p className='lead'>{description}</p>
    //   </div>
    //   <div className={className}>{children}</div>
    // </div>
    //////
    <div>
      <Menu />
      <div className='my-3' style={{ borderRadius: '15px', backgroundColor: '#4da3be' }}>
        <div className='container-fluid row'>
          {categories &&
            categories.map((c, i) => (
              <Link
                to={{ pathname: `/products/by/category/${c._id}`, param1: c.name }}
                className='col-1 mx-5 my-2'
                style={{ color: 'white', fontFamily: 'Arial', fontStretch: 'extra-expanded' }}
                key={i}>
                <strong>{c.name}</strong>
              </Link>
            ))}
        </div>
      </div>
      <div className={className}>{children}</div>
    </div>
  )
}

export default Layout
