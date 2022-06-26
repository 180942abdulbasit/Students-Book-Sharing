import React, { useState, useEffect } from 'react'
import '../styles.css'
import 'font-awesome/css/font-awesome.min.css'
import ReactStars from 'react-rating-stars-component'
import moment from 'moment'
import axios from 'axios'
import { API } from '../config'
import { Link, Redirect } from 'react-router-dom'

const Review = (props) => {
  const ratingChanged = (newRating) => {
    console.log(newRating)
  }

  const deleteReview = async (id) => {
    try {
      console.log('DELETE - ', id)
      const response = await axios.delete(`${API}/reviews/${id}`)
      if (response.status === 200) {
        console.log(response)
        props.onDelete(id)
      }
    } catch (error) {}
  }

  const authUser = JSON.parse(localStorage.getItem('jwt'))?.user

  return (
    <div className='row mb-5'>
      <div className='col-2'>
        <ReactStars
          classNames={'review-rating'}
          count={5}
          onChange={ratingChanged}
          size={23}
          value={props.review.rating}
          edit={false}
          isHalf={true}
          emptyIcon={<i class='fa-regular fa-star'></i>}
          halfIcon={<i class='fa-solid fa-star-half-stroke'></i>}
          fullIcon={<i class='fa-solid fa-star'></i>}
          activeColor='#222'
        />
        <span className='review-date'>on {moment(props.review.createdAt).format('dddd, MMMM Do YYYY')}</span>
      </div>
      <div className='col-10'>
        <div className='row mb-1 px-3'>
          <i className='fa-regular fa-circle-user fa-2x review-user'></i>
          <p className='mx-2 mt-1'>{props.review.user.name}</p>

          {authUser && authUser._id === props.review.user?._id ? (
            <div className='col-10'>
              <span className='mx-2 review-btn' onClick={() => deleteReview(props.review._id)}>
                <i class='fa-regular fa-trash-can fa-lg'></i>
              </span>
              <Link className='' to={`/review-edit/${props.review.product}/${props.review._id}`}>
                <span className='review-btn'>
                  <i class='fa-regular fa-pen-to-square fa-lg'></i>
                </span>
              </Link>
            </div>
          ) : null}
        </div>
        <h5 className='review-title'>{props.review.title}</h5>
      </div>

      <hr className='custom-hr' />
    </div>
  )
}

export default Review
