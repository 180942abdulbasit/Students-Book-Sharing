import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { deleteUserProducts, loadAllUsers, deleteUser, blockUser } from '../admin/apiAdmin'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import BackToDashboard from '../user/BackToDashboard'

let activeSort = false
const ViewAllUsers = () => {
  const [users, setUsers] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { user, token } = isAuthenticated()
  const [searchValue, setSearchValue] = useState('')
  const [changed, setChanged] = useState(false)

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
  }, [changed])

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
        message: 'Are you sure to change user status?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              blockUser(id, token).then((data) => {
                console.log('here1')
                if (data.error) {
                  console.log('here2')
                  setError(data.error)
                } else {
                  console.log('here')
                  setError('')
                  setChanged(!changed)
                  confirmAlert({
                    message: 'User Status Changed Successfully',
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

  const applySort = (sortBy) => (e) => {
    let arr = users

    if (sortBy === 'n') {
      if (activeSort == 'n') {
        arr.sort((a, b) => {
          return a.name < b.name
        })
        setUsers([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.name > b.name
        })
        setUsers([...arr])
        activeSort = 'n'
      }
    }
    if (sortBy === 'e') {
      if (activeSort == 'e') {
        arr.sort((a, b) => {
          return a.email < b.email
        })
        setUsers([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.email > b.email
        })
        setUsers([...arr])
        activeSort = 'e'
      }
    }
    if (sortBy === 'p') {
      if (activeSort == 'p') {
        arr.sort((a, b) => {
          return a.productsCount < b.productsCount
        })
        setUsers([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.productsCount > b.productsCount
        })
        setUsers([...arr])
        activeSort = 'p'
      }
    }
    if (sortBy === 's') {
      if (activeSort == 's') {
        arr.sort((a, b) => {
          return a.name < b.name
        })
        setUsers([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.name > b.name
        })
        setUsers([...arr])
        activeSort = 's'
      }
    }
  }

  const showSearchBar = () => (
    <div className='input-group mb-3'>
      <input
        name='search'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        type='text'
        className='form-control'
        placeholder='Filter by Name or Email'
      />
    </div>
  )

  const showTable = () =>
    loaded && (
      <table className='table table-hover'>
        <thead>
          <tr>
            <th width='5%'>#</th>
            <th width='20%' onClick={applySort('n')}>
              Name<i class='fa-solid fa-sort ml-2'></i>
            </th>
            <th width='20%' onClick={applySort('e')}>
              Email<i class='fa-solid fa-sort ml-2'></i>
            </th>
            <th width='10%' onClick={applySort('p')}>
              Products<i class='fa-solid fa-sort ml-2'></i>
            </th>
            <th width='10%'>View</th>
            <th width='10%' onClick={applySort('s')}>
              Status<i class='fa-solid fa-sort ml-2'></i>
            </th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((u) => u.name.match(new RegExp(searchValue, 'i')) || u.email.match(new RegExp(searchValue, 'i')))
            .map((u, i) => (
              <tr id={i}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.productsCount}</td>
                <td>
                  <Link to={`/user/userPage/${u._id}`}>
                    <button className='btn btn-primary btn-sm mb-1'>View Seller</button>
                  </Link>
                </td>
                <td>
                  <button
                    disabled={u._id === user._id}
                    className={u.status === 1 ? 'btn btn-primary btn-sm mb-1' : 'btn btn-danger btn-sm mb-1'}
                    onClick={handleDel('delUser', u._id)}>
                    {u.status === 1 ? 'Block' : 'Unblock'}
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
      {showSearchBar()}
      <div style={{ height: '340px', overflow: 'auto' }}>{showTable()}</div>
    </Layout>
  )
}

export default ViewAllUsers
