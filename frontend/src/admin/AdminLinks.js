import React from 'react'
import { Link } from 'react-router-dom'

const AdminLinks = () => {
  return (
    <div className='card'>
      <h4 className='card-header'>Admin Links</h4>
      <ul className='list-group'>
        <li className='list-group-item'>
          <Link className='nav-link' to='/create/category'>
            Create a new Category
          </Link>
        </li>
        <li className='list-group-item'>
          <Link className='nav-link' to='/create/subCategory'>
            Create a new SubCategory
          </Link>
        </li>
        <li className='list-group-item'>
          <Link className='nav-link' to='/update/category'>
            Update a Category
          </Link>
        </li>
        <li className='list-group-item'>
          <Link className='nav-link' to='/products'>
            View All Products
          </Link>
        </li>
        <li className='list-group-item'>
          <Link className='nav-link' to='/users'>
            View All Users
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default AdminLinks
