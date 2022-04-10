import React, { Fragment, useState } from 'react'
import { Link, Redirect, withRouter } from 'react-router-dom'
import { signout, isAuthenticated, isAdmin } from '../auth'
import { list } from './apiCore'

const isActive = (history, path) => {
  // history = whats in url path= what we pass as path name
  if (history.location.pathname === path) {
    return { color: '#000000', fontWeight: '700' }
  } else {
    return { color: '#6b6767' }
  }
}

const removeUnderline = () => {
  return { textDecoration: 'none', color: 'red' }
}
const Menu = (
  { history, match } // ({history}) = (props.hisotry) //destructuring
) => {
  const [data, setData] = useState({
    categories: [],
    category: '',
    search: '',
    results: [],
    searched: false,
  })

  const { categories, category, search, results, searched } = data
  const searchData = () => {
    list({ search: search || undefined, category: category }).then((response) => {
      if (response.error) {
        console.log(response.error)
      } else {
        setData({ ...data, results: response, searched: true })
      }
    })
  }
  const searchSubmit = (e) => {
    e.preventDefault()
    clickSearch()
  }
  const handleChange = (name) => (event) => {
    setData({ ...data, [name]: event.target.value, searched: false })
  }

  const clickSearch = () => {
    //return <Redirect to={`/shop/${search}`} />
    setData({ ...data, searched: true })
    //console.log(searched)
    //   searched = true
  }

  return (
    <div className='container-fluid'>
      <div className='row mt-2 mb-2'>
        <div className='col-lg-3'>
          <h4>Students Book Sharing</h4>
        </div>
        <div className='col-lg-5 mt-0 mb-0'>
          <form onSubmit={searchSubmit}>
            <div className='input-group'>
              <input
                type='text'
                className='form-control'
                onChange={handleChange('search')}
                placeholder={'Search by Title, Author or Institute Name'}

                // value={match ? match.params.search : ''}
              />
              <div className='input-group-append'>
                <button className='btn btn-outline-secondary' type='button' onClick={clickSearch}>
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className='col-lg-4 '>
          <ul className='nav nav-tabs justify-content-end'>
            <li className='nav-item'>
              <Link className='nav-link' style={isActive(history, '/')} to='/'>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' style={isActive(history, '/shop')} to='/shop'>
                Shop
              </Link>
            </li>
            {isAuthenticated() && !isAdmin() && (
              <li className='nav-item'>
                <Link className='nav-link' style={isActive(history, '/user/dashboard')} to='/user/dashboard'>
                  Dashbaord
                </Link>
              </li>
            )}
            {isAuthenticated() && isAdmin() && (
              <li className='nav-item'>
                <Link className='nav-link' style={isActive(history, '/admin/dashboard')} to='/admin/dashboard'>
                  Dashbaord
                </Link>
              </li>
            )}

            {!isAuthenticated() && (
              <Fragment>
                <li className='nav-item'>
                  <Link className='nav-link' style={isActive(history, '/signin')} to='/signin'>
                    signin
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' style={isActive(history, '/signup')} to='/signup'>
                    signup
                  </Link>
                </li>
              </Fragment>
            )}

            {isAuthenticated() && (
              <li className='nav-item'>
                <span
                  className='nav-link'
                  style={{ cursor: 'pointer', color: '#6b6767' }}
                  onClick={() =>
                    signout(() => {
                      history.push('/signin')
                    })
                  }>
                  signout
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
      {searched && search.length > 0 && <Redirect to={`/shop/search/${search}`} />}
      {searched && search.length === 0 && <Redirect to={`/shop/`} />}
    </div>
  )
}

export default withRouter(Menu)
