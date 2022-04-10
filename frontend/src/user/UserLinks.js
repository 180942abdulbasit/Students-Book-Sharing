import React from 'react'
import { Link } from 'react-router-dom'
import { isAuthenticated } from '../auth'

const UserLinks = () => {
  const { user, token } = isAuthenticated()
  return (
    <div className='card'>
      <h4 className='card-header'>User Links</h4>
      <ul className='list-group'>
        <li className='list-group-item'>
          <Link className='nav-link' to='/profile/update'>
            Update Profile
          </Link>
        </li>
        <li className='list-group-item'>
          <Link className='nav-link' to='/profile/changePassword'>
            Change Password
          </Link>
        </li>
        <li className='list-group-item'>
          <Link className='nav-link' to='/create/product'>
            Add Product
          </Link>
        </li>
        <li className='list-group-item'>
          <Link className='nav-link' to='/cart'>
            My Purchase History
          </Link>
        </li>
        <li className='list-group-item'>
          <Link className='nav-link' to='/userProducts'>
            My Products
          </Link>
        </li>
        <li className='list-group-item'>
          <Link className='nav-link' to={`/user/products/${user._id}`}>
            My Products View
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default UserLinks
