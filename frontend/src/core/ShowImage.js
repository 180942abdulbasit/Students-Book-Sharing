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
const ShowImage = ({ item, url, size = 'sm' }) => (
  <div className='product-img'>
    <img
      onMouseOver={mouseOver(size)}
      onMouseOut={mouseOut(size)}
      src={`${API}/${url}/photo/${item._id}`}
      alt={item.name}
      className='mx-auto'
      style={{
        // maxHeight: '100%',
        // maxWidth: '100%',
        //minHeight: '100%',
        //minWidth: '60%',
        borderTopRightRadius: size == 'sm' ? '15px' : '',
        borderTopLeftRadius: size == 'sm' ? '15px' : '',
        minWidth: size == 'lg' ? '80%' : '',
        maxWidth: size == 'sm' ? '100%' : '',
        //minWidth: size == 'sm' ? '100%' : '',
        //maxHeight: size == 'sm' ? '100%' : '',
        //minHeight: size == 'sm' ? '100%' : '',
        border: size == 'lg' ? '3px solid #ddd' : '',
        padding: size == 'lg' ? '0px' : '',
        zIndex: size == 'lg' ? '3' : '',
        minHeight: size == 'lg' ? '100%' : '',
      }}
    />
  </div>
)

export default ShowImage
