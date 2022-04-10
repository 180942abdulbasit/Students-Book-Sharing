import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { deleteUserProducts, loadAllUsers, deleteUser } from '../admin/apiAdmin'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import BackToDashboard from '../user/BackToDashboard'

const ViewAllUsers = () => {
  const [users, setUsers] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { user, token } = isAuthenticated()

  const init = () => {
    setLoaded(false)
    setLoading(true)
    loadAllUsers().then((data) => {
      if (data.error) {
        setError(data.error)
        setLoading(false)
      } else {
        setUsers(data)
        setLoaded(true)
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  const showLoading = () => {
    if (loading) {
      return (
        <div className='alert alert-info'>
          <h3>Loading...</h3>
        </div>
      )
    }
  }

  const handleDel = (type, id) => (e) => {
    if (type === 'delUser') {
      confirmAlert({
        message: 'Are you sure to delete the user?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              deleteUser(id, token).then((data) => {
                if (data.error) {
                  setError(data.error)
                } else {
                  setError('')
                  confirmAlert({
                    message: 'User deleted Successfully',
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
    if (type === 'delProducts') {
      confirmAlert({
        message: 'Are you sure to delete the products?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              deleteUserProducts(id, token).then((data) => {
                if (data.error) {
                  setError(data.error)
                } else {
                  setError('')
                  confirmAlert({
                    message: 'Products deleted Successfully',
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
  }

  const showError = () => (
    <div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  )

  const showTable = () =>
    loaded && (
      <table className='table table-hover'>
        <thead>
          <tr>
            <th width='3%'></th>
            <th width='15%'>Name</th>
            <th width='15%'>Email</th>
            <th width='10%'>Role</th>
            <th width='10%'>Products</th>
            <th width='5%'></th>
            <th width='5%'></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr id={i}>
              <td></td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role === 1 ? 'Admin' : 'User'}</td>
              <td>{u.productsCount}</td>
              <td>
                <Link to={`/user/userPage/${u._id}`}>
                  <button className='btn btn-primary btn-sm mb-1'>View Seller</button>
                </Link>
              </td>
              <td>
                <button disabled={u._id === user._id} className='btn btn-danger btn-sm mb-1' onClick={handleDel('delUser', u._id)}>
                  Delete Seller
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )

  return (
    <Layout
      title='Users List'
      description={`Hello ${user.name}!`}
      // className='container col-md-8 offset-md-2'
      className='container'>
      {showError()}
      {showLoading()}
      {BackToDashboard()}
      {showTable()}
    </Layout>
  )
}

export default ViewAllUsers
