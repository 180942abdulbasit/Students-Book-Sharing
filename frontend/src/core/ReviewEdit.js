import React, { useState, useEffect } from 'react'
import '../styles.css'
import 'font-awesome/css/font-awesome.min.css'
import StarRatings from 'react-star-ratings'
import TextareaAutosize from '@mui/base/TextareaAutosize'
import Layout from './Layout'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { API } from '../config'

const ReviewForm = () => {
  let history = useHistory()
  var { productId } = useParams()
  var { reviewId } = useParams()

  const [rating, setRating] = useState(1)
  const [comment, setComment] = useState('')
  const [updated, setUpdated] = useState(false)

  useEffect(() => {
    if (reviewId) {
      const fetchReview = async (id) => {
        let response = await axios.get(`${API}/reviews/${id}`)

        setComment(() => response.data.review.comment)
        setRating(() => response.data.review.rating)
        setUpdated(true)

        console.log('NEW RATING: ', rating)
        console.log('NEW Comment: ', comment)
      }
      fetchReview(reviewId)
    }
  }, [updated])

  let authUser = JSON.parse(localStorage.getItem('jwt')).user

  const submitReview = async () => {
    if (comment !== '' && rating >= 1) {
      const payload = {
        rating: rating,
        comment: comment,
        title: comment.substring(0, 20) + '....',
      }
      console.log(payload)
      try {
        const data = await axios.patch(`${API}/reviews/${reviewId}`, payload)
        setRating(1)
        setComment('')
        history.push(`/product/${productId}`)

        console.log(data.data)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <Layout className='container-fluid col-md-8 offset-md-2' title={'Review'} description=''>
      <div className='my-5'>
        <h2 className='text-center my-5'>Edit Review</h2>
        <div className='row overall-rating-stars-wrapper mb-4' style={{ marginLeft: '-25px' }}>
          <StarRatings
            rating={rating}
            starRatedColor='#fcba03'
            changeRating={(newRating) => setRating(newRating)}
            numberOfStars={5}
            name='rating'
            starHoverColor='#ff9900'
          />
        </div>
        <TextareaAutosize
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          aria-label='minimum height'
          minRows={3}
          placeholder='Write your comment here ...'
          style={{ width: '100%' }}
          className='p-3'
        />
        <div className='row my-5'>
          <div className='col'>
            <button className='btn btn-primary' style={{ minWidth: '100%' }} onClick={() => history.goBack()}>
              <i class='fa-solid fa-arrow-left fa-2x'></i>
            </button>
          </div>
          <div className='col'>
            <button className='btn btn-primary' style={{ minWidth: '100%' }} onClick={submitReview}>
              <i class='fa-solid fa-check fa-2x'></i>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ReviewForm
