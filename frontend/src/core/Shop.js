import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import Card from './Card'
import { getCategories, getSubCategories, getFilteredProducts, getFilteredProducts1 } from './apiCore'
//import { getSubCategories } from '../admin/apiAdmin'
import Checkbox from './Checkbox'
import Slider from '@material-ui/core/Slider'

const Shop = (props) => {
  const [myFilters, setMyFilters] = useState({
    filters: {
      category: [],
      subCategory: [],
      price: [],
    },
  })
  const items = 8
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(false)
  const [limit, setLimit] = useState(18)
  const [skip, setSkip] = useState(0)
  const [size, setSize] = useState(0)
  const [filteredResults, setFilteredResults] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [productsToDisplay, setProductsToDisplay] = useState(items)

  const [priceRangeFinal, setPriceRangeFinal] = useState([0, 5000])
  const [priceRangeInitial, setPriceRangeInitial] = useState(priceRangeFinal)

  const [selectedCategories, setSelectedCategories] = useState([])
  const [allSubcategories, setAllSubcategories] = useState([])
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
            setAllSubcategories(data2)
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
    console.log(filters, filterBy)
    const newFilters = { ...myFilters }
    newFilters.filters[filterBy] = filters
    setMyFilters(newFilters)
    loadFilteredResults(myFilters.filters)
  }

  const loadFilteredResults = (newFilters) => {
    getFilteredProducts1(skip, limit, props.match.params.search, newFilters).then((data) => {
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
    setProductsToDisplay(productsToDisplay + items)
  }

  const loadMoreButton = () => {
    if (filteredResults.length > productsToDisplay) {
      return (
        <div className='container mt-5'>
          <button onClick={loadMore} className='btn btn-danger mb-5'>
            Load More
          </button>
        </div>
      )
    }
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

  const handleChange = () => (e) => {
    var arr = filteredResults
    if (e.target.value === 'des') {
      arr.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
      setFilteredResults([...arr])
      console.log(filteredResults)
    }
    if (e.target.value === 'asc') {
      arr.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
      setFilteredResults([...arr])
      console.log(filteredResults)
    }
    if (e.target.value === 'old') {
      arr.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      })
      setFilteredResults([...arr])
    }
    if (e.target.value === 'new') {
      arr
        .sort((a, b) => {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        })
        .reverse()
      setFilteredResults([...arr])
    }
  }

  const categoryChanged = (c) => {
    let selectedCategoriesVariable = []
    const exists = selectedCategories.indexOf(c)
    if (exists === -1) {
      selectedCategoriesVariable = [...selectedCategories, c]
    } else {
      selectedCategoriesVariable = selectedCategories.filter((category) => category !== c)
    }

    setSelectedCategories(selectedCategoriesVariable)

    console.log('first', selectedCategoriesVariable)
    setSubCategories((state) => {
      return allSubcategories.filter((subcategory) => {
        const subExists = selectedCategoriesVariable.indexOf(subcategory.category._id)
        if (subExists !== -1) {
          return subcategory
        }
      })
    })
    console.log('c: ', c)
    console.log('selected-categories: ', selectedCategories)
    console.log('sub-categories: ', allSubcategories)
    console.log('filters: ', myFilters)
  }

  return (
    <Layout className='container-fluid' title='Shop Page' description='Find Books of your Choice'>
      <div className='row container-fluid' style={{ backgroundColor: '' }}>
        <div className='col-lg-3 col-sm-4 col-md-3' style={{ backgroundColor: 'rgb(245, 245, 245)' }}>
          <h5 className='mt-4'>Filter by Categories</h5>
          <ul>
            <Checkbox
              onCategoryChange={categoryChanged}
              name='Categories'
              categories={categories}
              handleFilters={(filters) => handleFilters(filters, 'category')}
              style={{ backgroundColor: 'red' }}
            />
          </ul>
          <h5>Filter by Sub Categories</h5>
          <ul>
            <Checkbox name='Sub Categories' categories={subCategories} handleFilters={(filters) => handleFilters(filters, 'subCategory')} />
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

        <div className='col-lg-9 col-sm-8 col-md-9'>
          <div className='row'>
            <div className='col-8'>
              <h2 className='heading-main'>Found {filteredResults && filteredResults.length} products</h2>
            </div>
            <div className='col-3' style={{ alignItems: 'right' }}>
              <select name='select' onChange={handleChange()} className='form-control'>
                <option key='1' value='new' var1=''>
                  Newest First
                </option>
                <option key='2' value='old' var1=''>
                  Oldest First
                </option>
                <option key='2' value='des' var1=''>
                  Price High to Low
                </option>
                <option key='4' value='asc' var1=''>
                  Price Low to High
                </option>
              </select>
            </div>
          </div>

          <div className='row'>
            {filteredResults && filteredResults.slice(0, productsToDisplay).map((p, i) => <Card key={i} product={p} page='Shop' size='home' />)}
          </div>
          <div className='text-center'>{loadMoreButton()}</div>
        </div>
      </div>
    </Layout>

    //////
  )
}

export default Shop
