import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const BackToDashboard = () => (
  <div className='my-3'>
    <Link to='/admin/dashboard' className='text-danger'>
      <i class='fa-solid fa-circle-arrow-left mr-2'></i>Back to Dashboard
    </Link>
  </div>
)

export default BackToDashboard
