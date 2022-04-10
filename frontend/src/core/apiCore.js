import { API } from '../config'
import queryString from 'query-string'

// export const getProducts = (sortBy) => {
//   return fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=6`, {
//     method: 'GET',
//   })
//     .then((response) => {
//       // console.log('...........',response.json())
//       return response.json()
//     })
//     .catch((err) => console.log(err))
// }

export const getProducts = (sortBy) => {
  return fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=6`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getCategories = () => {
  return fetch(`${API}/categories`, {
    method: 'GET',
  })
    .then((response) => {
      // console.log('...........',response.json())
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getSubCategories = () => {
  return fetch(`${API}/subCategories`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getFilteredProducts = (skip, limit, filters = {}) => {
  const data = {
    limit,
    skip,
    filters,
  }
  return fetch(`${API}/products/by/search`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json()
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getFilteredProducts1 = (skip, limit, search, filters = {}) => {
  const data = {
    limit,
    search,
    skip,
    filters,
  }
  return fetch(`${API}/products/by/search`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      return res.json()
    })
    .catch((err) => {
      console.log(err)
    })
}

export const list = (params) => {
  const query = queryString.stringify(params)
  return fetch(`${API}/products/search?${query}`, {
    method: 'GET',
  })
    .then((response) => {
      // console.log('...........',response.json())
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const read = (productId) => {
  return fetch(`${API}/product/${productId}`, {
    method: 'GET',
  })
    .then((response) => {
      // console.log('...........',response.json())
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const listRelated = (productId) => {
  return fetch(`${API}/products/related/${productId}`, {
    method: 'GET',
  })
    .then((response) => {
      // console.log('...........',response.json())
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getProductsByCategory = (productId) => {
  return fetch(`${API}/products/by/category/${productId}`, {
    method: 'GET',
  })
    .then((response) => {
      // console.log('...........',response.json())
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getProductsBySubCategory = (productId) => {
  return fetch(`${API}/products/by/subCategory/${productId}`, {
    method: 'GET',
  })
    .then((response) => {
      // console.log('...........',response.json())
      return response.json()
    })
    .catch((err) => console.log(err))
}
