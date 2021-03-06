import React, { useState, useEffect } from 'react'
import { getCategories, list } from './apiCore'
import Card from './Card'

const Search = () => {
  const [data, setData] = useState({
    categories: [],
    category: '',
    search: '',
    results: [],
    searched: false,
  })

  const { categories, category, search, results, searched } = data
  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setData({ ...data, categories: data })
      }
    })
  }
  useEffect(() => {
    loadCategories()
  }, [])

  const searchData = () => {
    list({ search: search || undefined, category: category }).then((response) => {
      if (response.error) {
        console.log(response.error)
      } else {
        setData({ ...data, results: response, searched: true })
      }
    })
  }
  const searchSubmit = (e) => {
    e.preventDefault()
    searchData()
  }
  const handleChange = (name) => (event) => {
    setData({ ...data, [name]: event.target.value, searched: false })
  }
  const searchMessage = (searched, results) => {
    if (searched) {
      if (results.length == 1) {
        return `Found 1 product`
      } else if (results.length > 0) {
        return `Found ${results.length} products`
      } else {
        return `No products found`
      }
    }
  }
  const searchedProducts = (results = []) => {
    return (
      <div>
        <h2 className='mt-4 mb-4'>{searchMessage(searched, results)}</h2>
        <div className='row'>
          {results.map((p, i) => (
            <Card key={i} product={p} />
          ))}
        </div>
      </div>
    )
  }
  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <span className='input-group-text'>
        <div className='input-group input-group-lg'>
          <div className='input-group-prepend'></div>
          <input type='search' className='form-control' onChange={handleChange('search')} placeholder='Search by Title, Author or Institute Name' />
        </div>
        <div className='btn input-group-append' style={{ border: 'none' }}>
          <button className='input-group-text'>Search</button>
        </div>
      </span>
    </form>
  )
  return (
    <div className='row'>
      <div className='container'>{searchForm()}</div>
      <div className='container-fluid mb-3'>{searchedProducts(results)}</div>
    </div>
  )
}

export default Search
