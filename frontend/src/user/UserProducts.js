import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { deleteProduct, deleteProducts, getUserProducts, changeProductStatus } from '../admin/apiAdmin'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import BackToDashboard from './BackToDashboard'

let activeSort = false
const UserProducts = () => {
  const [userProducts, setUserProducts] = useState([])
  const [delProducts, setDelProducts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { user, token } = isAuthenticated()
  const [searchValue, setSearchValue] = useState('')
  const [changed, setChanged] = useState(false)

  const init = () => {
    getUserProducts(user).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setUserProducts(data)
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    init()
  }, [changed])

  const handleDel = (id) => (e) => {
    setError('')
    id && delProducts.indexOf(id) === -1 && delProducts.push(id)
    if (delProducts.length > 0) {
      confirmAlert({
        message: 'Are you sure to change status of this product?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
              changeProductStatus(user._id, token, id).then((data) => {
                if (data.error) {
                  setError(data.error)
                } else {
                  setError('')
                  setUserProducts(userProducts.filter((item) => item !== id))
                  setChanged(!changed)
                  confirmAlert({
                    message: 'Product status updated Successfully',
                    buttons: [{ label: 'OK' }],
                  })
                }
              })
            },
          },
          {
            label: 'No',
            onClick: () => {
              id && setDelProducts([])
            },
          },
        ],
      })
    }
  }

  const handleCheckbox = (p) => () => {
    if (delProducts.indexOf(p) === -1) {
      delProducts.push(p)
    } else {
      delProducts.splice(
        delProducts.findIndex(function (i) {
          return p === i
        }),
        1
      )
    }
  }
  const showLoading = () => {
    if (loading) {
      return (
        <div className='alert alert-info'>
          <h3>Loading...</h3>
        </div>
      )
    }
  }

  const showError = () => (
    <div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  )

  const applySort = (sortBy) => (e) => {
    let arr = userProducts
    if (sortBy === 'n') {
      if (activeSort == 'n') {
        arr.sort((a, b) => {
          return a.name < b.name
        })
        setUserProducts([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.name > b.name
        })
        setUserProducts([...arr])
        activeSort = 'n'
      }
    }
    if (sortBy === 'p') {
      if (activeSort == 'p') {
        arr.sort((a, b) => {
          return a.price < b.price
        })
        setUserProducts([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.price > b.price
        })
        setUserProducts([...arr])
        activeSort = 'p'
      }
    }
    if (sortBy === 'c') {
      if (activeSort == 'c') {
        arr.sort((a, b) => {
          return a.category.name < b.category.name
        })
        setUserProducts([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.category.name > b.category.name
        })
        setUserProducts([...arr])
        activeSort = 'c'
      }
    }
    if (sortBy === 'l') {
      if (activeSort == 'l') {
        arr.sort((a, b) => {
          return a.updatedAt < b.updatedAt
        })
        setUserProducts([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.updatedAt > b.updatedAt
        })
        setUserProducts([...arr])
        activeSort = 'l'
      }
    }
    if (sortBy === 's') {
      if (activeSort == 's') {
        arr.sort((a, b) => {
          return a.status < b.status
        })
        setUserProducts([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.status > b.status
        })
        setUserProducts([...arr])
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
        placeholder='Filter by Name or Category'
      />
    </div>
  )

  const showTable = () =>
    userProducts && (
      <table className='table table-hover'>
        <thead>
          <tr>
            <th width='5%'>#</th>
            <th width='20%' onClick={applySort('n')}>
              Name<i class='fa-solid fa-sort ml-2'></i>
            </th>
            <th width='10%' onClick={applySort('p')}>
              Price<i class='fa-solid fa-sort ml-2'></i>
            </th>
            <th width='20%' onClick={applySort('c')}>
              Category<i class='fa-solid fa-sort ml-2'></i>
            </th>
            <th width='17%' onClick={applySort('l')}>
              Last Updated<i class='fa-solid fa-sort ml-2'></i>
            </th>
            <th width='5%'>View</th>
            <th width='5%' onClick={applySort('s')}>
              Status<i class='fa-solid fa-sort ml-2'></i>
            </th>
          </tr>
        </thead>
        <tbody>
          {userProducts
            .filter((p) => p.name.match(new RegExp(searchValue, 'i')) || p.category.name.match(new RegExp(searchValue, 'i')))
            .map((p, i) => (
              <tr id={i}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.category.name}</td>
                <td>{moment(p.updatedAt).fromNow()}</td>

                <td>
                  <Link to={`/product/${p._id}`}>
                    <button className='btn btn-primary btn-sm mb-1'>View Product</button>
                  </Link>
                </td>
                <td>
                  <button
                    className={p.status === 1 ? 'btn btn-primary btn-sm mb-1' : 'btn btn-danger btn-sm mb-1'}
                    onClick={handleDel(p._id)}
                    style={{ width: '100%' }}>
                    {p.status === 1 ? 'Mark as Unavailable' : 'Mark as Available'}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    )

  return (
    <Layout title='User Products' description={`Hello ${user.name}!`} className='container'>
      {showError()}
      {showLoading()}
      {BackToDashboard()}
      {showSearchBar()}
      <div style={{ height: '330px', overflow: 'auto' }}>{showTable()}</div>
    </Layout>
  )
}

export default UserProducts
