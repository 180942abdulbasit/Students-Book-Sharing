import React from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import UserLinks from './UserLinks'
import UserInfo from './UserInfo'

const UserDashboard = () => {
  const {
    user: { _id, name, email, role },
  } = isAuthenticated()

  return (
    <Layout title='User Dashboard' description={`Hello ${name}!`} className='container-fluid'>
      <div className='container' style={{ display: 'flex' }}>
        <div style={{ flex: '10%', flexDirection: 'column', marginRight: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <UserLinks />
          </div>
        </div>
        <div style={{ flex: '60%' }}>
          <UserInfo _id={_id} name={name} email={email} role={role} />
        </div>
      </div>
    </Layout>
  )
}

export default UserDashboard
