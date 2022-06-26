import React from 'react'
import { API } from '../config'

const mouseOut = (size) => (e) => {
  if (size == 'lg') {
    e.target.style.background = ''
    e.target.style.transform = 'scale(1)'
    e.target.style.transition = '0.3s'
  }
}
const mouseOver = (size) => (e) => {
  if (size == 'lg') {
    e.target.style.transform = 'scale(1.5)'
    e.target.style.cursor = 'pointer'
    e.target.style.transition = '0.3s'
  }
}
const ShowImage2 = ({ item, url, size = 'sm' }) => (
  <img
    onMouseOver={mouseOver(size)}
    onMouseOut={mouseOut(size)}
    src={`${API}/${url}/photo/${item._id}`}
    alt={item.name}
    className='mx-auto'
    style={{
      borderTopRightRadius: size == 'sm' ? '15px' : '',
      borderTopLeftRadius: size == 'sm' ? '15px' : '',
      height: '100%',
      width: '100%',
      border: size == 'lg' ? '0px solid #ddd' : '',
      padding: size == 'lg' ? '0px' : '',
      zIndex: size == 'lg' ? '3' : '',
    }}
  />
)

export default ShowImage2
