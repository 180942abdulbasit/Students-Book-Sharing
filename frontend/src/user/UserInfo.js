import React from 'react'

const UserInfo = ({ _id, name, email, role }) => {
  return (
    <div className='card mb-5'>
      <h3 className='card-header'>User Profile</h3>
      <ul className='list-group'>
        <li className='list-group-item'>Name: {name}</li>
        <li className='list-group-item'>Email: {email}</li>
        <li className='list-group-item'>
          User Type: {role === 1 ? 'Admin' : 'Standard User'}
        </li>
      </ul>
    </div>
  )
}

export default UserInfo
