import React, { useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import '../styles.css'
import { components } from 'react-select'
import { default as ReactSelect } from 'react-select'

const Checkbox = ({ name, categories, handleFilters, onCategoryChange }) => {
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
    if(typeof onCategoryChange==="function"){
      onCategoryChange(c)
    }
    setChecked(newCheckedCategoryId)
    handleFilters(newCheckedCategoryId)
  }

  // return categories.map((c, i) => (
  //   <li key={i} className='list-unstyled'>
  //     <input onChange={handleToggle(c._id)} value={checked.indexOf(c._id === -1)} type='checkbox' className='form-check-input' />
  //     <label className='form-check-label'>{c.name}</label>
  //   </li>
  // ))

  /////

  return (
    <Dropdown className='d-inline mx-0' autoClose='outside' width='100%'>
      <Dropdown.Toggle id='dropdown-autoclose-outside dropdown-variants-secondary' variant='secondary'>
        {`${name}`}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {categories.map((c, i) => (
          <div className='row'>
            <div className='col px-0'>
              <Dropdown.Item>
                <label className=''>{c.name}</label>
              </Dropdown.Item>
            </div>
            <div className='col-1 px-0 mt-2'>
              <input onChange={handleToggle(c._id)} value={checked.indexOf(c._id === -1)} type='checkbox' className='form-check-input' />
            </div>
          </div>
        ))}
      </Dropdown.Menu>
    </Dropdown>

    ////
  )
}

export default Checkbox
