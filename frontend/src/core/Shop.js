import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import Card from './Card'
import Card2 from './Card2'
import { getCategories, getSubCategories, getFilteredProducts, getFilteredProducts1 } from './apiCore'
//import { getSubCategories } from '../admin/apiAdmin'
import Checkbox from './Checkbox'
import Slider from '@material-ui/core/Slider'

const Shop = (props) => {
  const [myFilters, setMyFilters] = useState({
    filters: {
      category: [],
      price: [],
    },
  })
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(false)
  const [limit, setLimit] = useState(18)
  const [skip, setSkip] = useState(0)
  const [size, setSize] = useState(0)
  const [filteredResults, setFilteredResults] = useState([])
  const [subCategories, setSubCategories] = useState([])

  const [priceRangeFinal, setPriceRangeFinal] = useState([0, 5000])
  const [priceRangeInitial, setPriceRangeInitial] = useState(priceRangeFinal)

  const init = () => {
    getCategories().then((data1) => {
      if (data1.error) {
        setError(data1.error)
      } else {
        getSubCategories().then((data2) => {
          if (data2.error) {
            setError(data2.error)
          } else {
            setCategories(data1)
            setSubCategories(data2)
          }
        })
      }
    })
  }

  useEffect(() => {
    init()
    loadFilteredResults(skip, limit, myFilters.filters)
  }, [props])

  const handleFilters = (filters, filterBy) => {
    const newFilters = { ...myFilters }
    newFilters.filters[filterBy] = filters
    loadFilteredResults(myFilters.filters)
    setMyFilters(newFilters)
    // if (filterBy === 'category') {
    //   //console.log(filters)
    //   loadSubCategories(filters)
    // }
    //newFilters.filters['search'] = props.match.params.search
  }

  const loadFilteredResults = (newFilters) => {
    // getFilteredProducts(skip, limit, newFilters).then((data) => {
    //   if (data.error) {
    //     setError(data.error)
    //   } else {
    //     setFilteredResults(data.data)
    //     setSize(data.size)
    //     setSkip(0)
    //   }
    // })
    getFilteredProducts1(skip, limit, props.match.params.search, newFilters).then((data) => {
      //console.log(newFilters)
      if (data.error) {
        setError(data.error)
      } else {
        setFilteredResults(data)
        setSize(data.size)
        setSkip(0)
      }
    })
  }

  const loadMore = () => {
    let toSkip = skip + limit
    getFilteredProducts(toSkip, limit, myFilters.filters).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setFilteredResults([...filteredResults, ...data.data])
        setSize(data.size)
        setSkip(toSkip)
      }
    })
  }

  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <div className='container'>
          <button onClick={loadMore} className='btn btn-warning mb-5'>
            Load More
          </button>
        </div>
      )
    )
  }
  const rangeSelector = (event, newValue) => {
    setPriceRangeInitial(newValue)
  }

  const rangeSetter = (event, newValue) => {
    setPriceRangeFinal(newValue)
    const newFilters = { ...myFilters }
    newFilters.filters['price'] = newValue
    loadFilteredResults(myFilters.filters)
    setMyFilters(newFilters)
  }

  const loadSubCategories = (categoryId) => {
    getSubCategories(categoryId).then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setSubCategories({ ...subCategories, data })
      }
    })
  }

  return (
    <Layout className='container-fluid' title='Shop Page' description='Find Books of your Choice'>
      <div className='row'>
        <div className='col-2'>
          <h5>Filter by Categories</h5>
          <ul>
            <Checkbox categories={categories} handleFilters={(filters) => handleFilters(filters, 'category')} style={{ backgroundColor: 'red' }} />
          </ul>
          <h5>Filter by SubCategories</h5>
          <ul>
            <Checkbox categories={subCategories} handleFilters={(filters) => handleFilters(filters, 'subCategory')} />
          </ul>
          <h5>Filter by Price Range</h5>
          <ul>
            {`Rs.${priceRangeInitial[0]}`} &nbsp; &nbsp; &nbsp;to &nbsp; &nbsp;Rs.{`${priceRangeInitial[1]}`}
          </ul>
          <ul>
            <Slider
              max={5000}
              min={0}
              value={priceRangeInitial}
              onChange={rangeSelector}
              onChangeCommitted={rangeSetter}
              valueLabelDisplay='off'
              step={50}
            />
          </ul>
        </div>

        <div className='col-10'>
          <h2 className='mb-4'>Found {filteredResults && filteredResults.length} products</h2>
          <div className='row'>{filteredResults && filteredResults.map((p, i) => <Card key={i} product={p} page='Shop' />)}</div>
          <div className='text-center'>{loadMoreButton()}</div>
        </div>
      </div>
    </Layout>
  )
}

export default Shop
