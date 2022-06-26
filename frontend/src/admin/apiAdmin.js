import { API } from '../config'

export const createCategory = (userId, token, category) => {
  return fetch(`${API}/category/create/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => {
      console.log(err)
    })
}

export const updateCategory = (userId, token, categoryId, categoryName) => {
  return fetch(`${API}/category/${categoryId}/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryName),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => {
      console.log(err)
    })
}

export const createProduct = (userId, token, product) => {
  return fetch(`${API}/product/create/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: product,
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => {
      console.log(err)
    })
}

export const updateProduct = (userId, token, productId, product) => {
  return fetch(`${API}/product/${productId}/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: product,
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getCategories = () => {
  return fetch(`${API}/categories`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getUserProducts = (user) => {
  return fetch(`${API}/products/${user._id}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getSubCategories = (categoryId) => {
  return fetch(`${API}/subCategories/${categoryId}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const createSubCategory = (userId, token, subCategory) => {
  return fetch(`${API}/subCategory/create/${userId}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subCategory),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAuthors = () => {
  return fetch(`${API}/products/authors`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const getInstitutes = () => {
  return fetch(`${API}/products/institutes`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const deleteProduct = (userId, token, product) => {
  return fetch(`${API}/product/${product}/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const changeProductStatus = (userId, token, product) => {
  return fetch(`${API}/product/status/${product}/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const deleteUser = (userId, token) => {
  return fetch(`${API}/user/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const blockUser = (userId, token) => {
  return fetch(`${API}/user/block/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const deleteProducts = (userId, token, products) => {
  products.forEach((product) => {
    console.log(product)
    return fetch(`${API}/product/${product}/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('res', response)
        return response.json()
      })
      .catch((err) => console.log('err', err))
  })
}

export const loadAllProducts = () => {
  return fetch(`${API}/view/allProducts`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const loadAllUsers = () => {
  return fetch(`${API}/view/allUsers`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log(err))
}

export const deleteUserProducts = (userId, token) => {
  return fetch(`${API}/products/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log('err', err))
}

export const readUser = (userId) => {
  return fetch(`${API}/user/${userId}`, {
    method: 'GET',
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => console.log('err', err))
}

export const updateProfile = (user, token) => {
  return fetch(`${API}/user/${user._id}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => {
      console.log(err)
    })
}

export const updateLocalStorage = (user, next) => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('jwt')) {
      let auth = JSON.parse(localStorage.getItem('jwt'))
      auth.user.name = user.name
      auth.user.email = user.email
      localStorage.setItem('jwt', JSON.stringify(auth))
      next()
    }
  }
}

export const changePassword = (user, token) => {
  return fetch(`${API}/user/${user._id}/changePassword`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  })
    .then((response) => {
      return response.json()
    })
    .catch((err) => {
      console.log(err)
    })
}
