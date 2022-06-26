import React, { useState, useEffect } from 'react'
import Layout from './Layout'
import { getProducts } from './apiCore'
import Card from './Card'
import Search from './Search'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'

const Home = () => {
  const [productsBySell, setProductsBySell] = useState([])
  const [productsByArrival, setProductsByArrival] = useState([])
  const [error, setError] = useState(false)
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  const loadProductBySell = () => {
    getProducts('sold').then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setProductsBySell(data)
      }
    })
  }
  const loadProductByArrival = () => {
    getProducts('createdAt').then((data) => {
      if (data.error) {
        setError(data.error)
      } else {
        setProductsByArrival(data)
      }
    })
  }
  useEffect(() => {
    loadProductByArrival()
    loadProductBySell()
  }, [])
  return (
    <Layout className='container-fluid col-md-10 offset-md-1' title='Student Book Sharing' description='Home Page to Student Book Sharing'>
      {/* <Search /> */}

      <h2 className='heading-main'>New Arrivals</h2>
      <div className='row'>
        {productsByArrival.map((p, i) => (
          <Card key={i} product={p} page='Home' />
        ))}
      </div>
      <h2 className='heading-main'>Popular Books</h2>
      <div className='row'>
        {productsBySell.map((p, i) => (
          <Card key={i} product={p} page='Home' />
        ))}
      </div>

      {/* <div className='row'>
        <Slider {...settings}>
          {productsBySell.map((p, i) => (
            <Card key={i} product={p} page='Home' />
          ))}
        </Slider>
      </div>
      <Slider {...settings}>
        <div>
          <h3>1</h3>
        </div>
        <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div>
      </Slider> */}
    </Layout>
  )
}
export default Home
