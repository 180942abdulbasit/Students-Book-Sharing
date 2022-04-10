import React, { useState, useEffect, useLayoutEffect } from 'react'
import Layout from '../core/Layout'
import '../styles.css'
import { isAuthenticated } from '../auth'
import { createProduct, getCategories, getSubCategories, getInstitutes, getAuthors } from '../admin/apiAdmin'
import BackToDashboard from './BackToDashboard'

const AddProduct = () => {
  const { user, token } = isAuthenticated()
  const [authorSuggestions, setAuthorSuggestions] = useState([])
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    author: '',
    authors: [],
    categories: [],
    category: '',
    selectedCategory: '',
    subCategories: [],
    subCategory: '',
    institute: '',
    institutes: [],
    photo: '',
    loading: '',
    error: '',
    createdProduct: '',
    redirectToProfile: false,
    formData: '',
    existingAuthors: [],
    existngInstitutes: [],
  })

  const {
    name,
    description,
    price,
    categories,
    category,
    selectedCategory,
    subCategory,
    subCategories,
    author,
    authors,
    institutes,
    institute,
    existingAuthors,
    existngInstitutes,
    loading,
    error,
    createdProduct,
    redirectToProfile,
    formData,
  } = values

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, categories: data, formData: new FormData() })
      }
    })
  }

  const loadSubCategories = (categoryId) => {
    getSubCategories(categoryId).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, subCategories: data })
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  // const handleChange = (name) => (event) => {
  //   //first it will grab the name then event... it is a function in a function
  //   const value = name === 'photo' ? event.target.files[0] : event.target.value
  //   formData.set(name, value)
  //   setValues({ ...values, error: '', createdProduct: '', [name]: value })
  //   if (name === 'category') {
  //     //selectedCategory = event.target.selectedOptions[0].getAttribute('var1')
  //     //setValues({ ...values, selectedCategory: event.target.selectedOptions[0].getAttribute('var1') })
  //     console.log(name)

  //     loadSubCategories(event.target.value)
  //   }
  //   if (name === 'author') {
  //     let matches = []
  //     matches = existingAuthors.filter((item) => item.includes(author))
  //     setAuthorSuggestions(matches)
  //   }
  // }

  const handleChange = (name) => (event) => {
    //first it will grab the name then event... it is a function in a function
    const value = name === 'photo' ? event.target.files[0] : event.target.value
    formData.set(name, value)

    if (name === 'category') {
      setValues({ ...values, error: '', createdProduct: '', [name]: value })
      loadSubCategories(event.target.value)
      //myFunc(event.target.selectedOptions[0].getAttribute('var1'))
    } else if (name === 'author') {
      let matches = []
      matches = existingAuthors.filter((item) => item.includes(author))
      setAuthorSuggestions(matches)
      setValues({ ...values, error: '', createdProduct: '', [name]: value })
    } else {
      setValues({ ...values, error: '', createdProduct: '', [name]: value })
    }
  }

  const clickSubmit = (event) => {
    event.preventDefault()
    institutes.forEach((i, index) => {
      formData.append(`institutes${index}`, i)
    })
    authors.forEach((a, index) => {
      formData.append(`authors${index}`, a)
    })
    setValues({ ...values, error: '', loading: true })
    createProduct(user._id, token, formData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({
          ...values,
          name: '',
          description: '',
          photo: '',
          price: '',
          category: '',
          subCategory: '',
          loading: false,
          createdProduct: data.name,
          author: '',
          institute: '',
          institutes: [],
          authors: [],
        })
      }
    })
  }

  const clickAddButton = (name) => (event) => {
    if (name === 'institute' && institute.length > 0) {
      setValues({
        ...values,
        institutes: institutes.indexOf(institute) === -1 ? [...institutes, institute] : [...institutes],
        institute: '',
      })
    }
    if (name === 'author' && author.length > 0) {
      setValues({
        ...values,
        authors: authors.indexOf(author) === -1 ? [...authors, author] : [...authors],
        author: '',
      })
    }
  }

  const newPostForm = () => (
    <form className='mb-3' onSubmit={clickSubmit} id='form'>
      <div className='form-group'>
        <label className='text-muted'>Name</label>
        <input onChange={handleChange('name')} type='text' className='form-control' value={name} />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Description</label>
        <textarea onChange={handleChange('description')} className='form-control' value={description} />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Price</label>
        <input onChange={handleChange('price')} type='number' className='form-control' value={price} />
      </div>
      <div className='form-group'>
        <label className='text-muted'>Category</label>
        <select name='selectCat' onChange={handleChange('category')} className='form-control'>
          <option>Please Select</option>
          {categories &&
            categories.map((c, i) => (
              <option key={i} value={c._id} var1={c.name}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
      {subCategories.length > 0 && (
        <div className='form-group'>
          <label className='text-muted'>Sub Category</label>
          <select onChange={handleChange('subCategory')} className='form-control'>
            <option>Please Select</option>
            {subCategories &&
              subCategories.map((s, i) => (
                <option key={i} value={s._id}>
                  {s.name}
                </option>
              ))}
          </select>
        </div>
      )}
      <div className='form-group'>
        <label className='text-muted'>Authors</label>
        <div className='input-group'>
          <input onChange={handleChange('author')} type='text' className='form-control' value={author} />

          <div className='input-group-append'>
            <button className='btn btn-outline-secondary' onClick={clickAddButton('author')} type='button'>
              Add Author
            </button>
          </div>
        </div>
      </div>
      <div className='form-group'>
        <label className='text-muted'>Institutes</label>
        <div className='input-group'>
          <input onChange={handleChange('institute')} type='text' className='form-control' value={institute} />
          <div className='input-group-append'>
            <button className='btn btn-outline-secondary' onClick={clickAddButton('institute')} type='button'>
              Add Institute
            </button>
          </div>
        </div>
      </div>
      <div className='form-group'>
        <label className='btn btn-secondary'>
          Select Photo
          <input onChange={handleChange('photo')} type='file' name='photo' accept='image/*' />
        </label>
      </div>
      <button className='btn btn-outline-primary' type='submit'>
        Create Product
      </button>
    </form>
  )

  const showError = () => (
    <div className='alert alert-danger' style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  )

  const showSuccess = () => (
    <div className='alert alert-info' style={{ display: createdProduct ? '' : 'none' }}>
      <h2>{`${createdProduct}`} is created.</h2>
    </div>
  )

  const showLoading = () =>
    loading && (
      <div className='alert alert-success'>
        <h2>Loading</h2>
      </div>
    )

  return (
    <Layout title='Add a new Product' description={`Hello ${user.name}!`} className='container-fluid'>
      <div className='row'>
        <div className='col-md-8 offset-md-2'>
          {showLoading()}
          {showSuccess()}
          {showError()}
          {newPostForm()}
          {BackToDashboard()}
        </div>
      </div>
    </Layout>
  )
}

export default AddProduct
