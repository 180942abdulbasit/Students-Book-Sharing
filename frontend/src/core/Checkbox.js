import React, { useState } from 'react'

const Checkbox = ({ categories, handleFilters }) => {
  const [checked, setChecked] = useState([])

  //console.log(category)
  const handleToggle = (c) => () => {
    const currCategoryId = checked.indexOf(c) // checks if ticked category is already in the array or not
    const newCheckedCategoryId = [...checked]
    if (currCategoryId === -1) {
      newCheckedCategoryId.push(c)
    } else {
      newCheckedCategoryId.splice(currCategoryId, 1)
    }
    setChecked(newCheckedCategoryId)
    handleFilters(newCheckedCategoryId)
  }

  return categories.map((c, i) => (
    <li key={i} className='list-unstyled'>
      <input onChange={handleToggle(c._id)} value={checked.indexOf(c._id === -1)} type='checkbox' className='form-check-input' />
      <label className='form-check-label'>{c.name}</label>
    </li>
  ))
}

export default Checkbox
