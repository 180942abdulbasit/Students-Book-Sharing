import React, { useState, useEffect } from 'react'
import Layout from '../core/Layout'
import { isAuthenticated } from '../auth'
import { changeProductStatus, deleteProduct, deleteProducts, loadAllProducts } from '../admin/apiAdmin'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import BackToDashboard from '../user/BackToDashboard'

let activeSort = false
const ViewAllProducts = () => {
  const [products, setProducts] = useState([])
  const [delProducts, setDelProducts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { user, token } = isAuthenticated()
  const [changed, setChanged] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const init = () => {
    console.log('init')
    loadAllProducts().then((data) => {
      if (data.error) {
        setError(data.error)
        setLoading(false)
      } else {
        setProducts(data)
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

  const applySort = (sortBy) => (e) => {
    let arr = products

    if (sortBy === 'r') {
      if (activeSort == 'r') {
        arr.sort((a, b) => {
          return a.reportUsers.length < b.reportUsers.length
        })
        setProducts([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.reportUsers.length > b.reportUsers.length
        })
        setProducts([...arr])
        activeSort = 'r'
      }
    }
    if (sortBy === 'n') {
      if (activeSort == 'n') {
        arr.sort((a, b) => {
          return a.name < b.name
        })
        setProducts([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.name > b.name
        })
        setProducts([...arr])
        activeSort = 'n'
      }
    }
    if (sortBy === 'p') {
      if (activeSort == 'p') {
        arr.sort((a, b) => {
          return a.price < b.price
        })
        setProducts([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.price > b.price
        })
        setProducts([...arr])
        activeSort = 'p'
      }
    }
    if (sortBy === 'c') {
      if (activeSort == 'c') {
        arr.sort((a, b) => {
          return a.category.name < b.category.name
        })
        setProducts([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.category.name > b.category.name
        })
        setProducts([...arr])
        activeSort = 'c'
      }
    }
    if (sortBy === 'l') {
      if (activeSort == 'l') {
        arr.sort((a, b) => {
          return a.updatedAt < b.updatedAt
        })
        setProducts([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.updatedAt > b.updatedAt
        })
        setProducts([...arr])
        activeSort = 'l'
      }
    }
    if (sortBy === 'b') {
      if (activeSort == 'b') {
        arr.sort((a, b) => {
          return a.createdBy.name.charAt(0).toUpperCase() < b.createdBy.name.charAt(0).toUpperCase()
        })
        setProducts([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.createdBy.name.charAt(0).toUpperCase() > b.createdBy.name.charAt(0).toUpperCase()
        })
        setProducts([...arr])
        activeSort = 'b'
      }
    }
    if (sortBy === 's') {
      if (activeSort == 's') {
        arr.sort((a, b) => {
          return a.status < b.status
        })
        setProducts([...arr])
        activeSort = false
      } else {
        arr.sort((a, b) => {
          return a.status > b.status
        })
        setProducts([...arr])
        activeSort = 's'
      }
    }
  }
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
                  setProducts(products.filter((item) => item !== id))
                  setChanged(!changed)
                  confirmAlert({
                    message: 'Product status changed Successfully',
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

  const showError = () => (
    <div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  )

  const showSearchBar = () => (
    <div className='input-group mb-3'>
      <input
        name='search'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        type='text'
        className='form-control'
        placeholder='Filter by Product Name or Seller Name'
      />
    </div>
  )

  const showTable = () =>
    products && (
      <table className='table table-hover'>
        <thead>
          <tr>
            <th width='2%'>#</th>
            <th width='20%' onClick={applySort('n')}>
              Name
              <i class='fa-solid fa-sort ml-2'></i>
            </th>
            <th width='10%' onClick={applySort('p')}>
              Price<i class='fa-solid fa-sort ml-2'></i>
            </th>
            <th width='15%' onClick={applySort('c')}>
              Category<i class='fa-solid fa-sort ml-2'></i>
            </th>
            <th width='20%' onClick={applySort('l')}>
              Last Updated<i class='fa-solid fa-sort ml-2'></i>
            </th>

            <th width='20%' onClick={applySort('b')}>
              Created By<i class='fa-solid fa-sort ml-2'></i>
            </th>
            <th width='20%' onClick={applySort('r')}>
              #Reports<i class='fa-solid fa-sort ml-2'></i>
            </th>
            <th width='2%'>View</th>
            <th width='2%' onClick={applySort('s')}>
              Status<i class='fa-solid fa-sort ml-2'></i>
            </th>
          </tr>
        </thead>

        <tbody>
          {products
            .filter((p) => p.name.match(new RegExp(searchValue, 'i')) || p.createdBy.name.match(new RegExp(searchValue, 'i')))
            .map((p, i, l) => (
              <tr id={i}>
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.category.name}</td>
                <td>{moment(p.updatedAt).fromNow()}</td>
                <td>{p.createdBy._id === user._id ? ' You' : ` ${p.createdBy.name}`}</td>
                <td>{p.reportUsers.length}</td>
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
                    {p.status === 1 ? 'Mark Unavailable' : 'Mark Available'}
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
export default ViewAllProducts
