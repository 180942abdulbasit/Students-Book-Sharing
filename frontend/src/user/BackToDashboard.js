import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const BackToDashboard = () => (
  <div className='mt-5'>
    <Link to='/admin/dashboard' className='text-warning'>
      Back to Dashboard
    </Link>
  </div>
)

export default BackToDashboard
