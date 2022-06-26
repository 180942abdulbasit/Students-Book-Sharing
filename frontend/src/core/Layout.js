import React, { useState, useEffect, Fragment } from 'react'
import Menu from './Menu'
import SecondMenu from './SecondMenu'
import { getCategories } from './apiCore'
import { getSubCategories } from '../admin/apiAdmin'
import '../styles.css'
import { BrowserRouter, Link, Redirect, useHistory } from 'react-router-dom'
import { NavDropdown } from 'react-bootstrap'
import Snackbar from '@mui/material/Snackbar'
import { Button } from 'react-bootstrap'

//Snackbar Imports
import { useSnackbar } from 'notistack'
import { matchPath, useLocation } from 'react-router-dom'
//End

//Socket
import openSocket from 'socket.io-client'
const socket = openSocket('http://localhost:8002')
//Socket ends
let uId = null
const Layout = ({ title = 'Title', description = 'Description', className, children }) => {
  const [data, setData] = useState({
    categories: [],
    error: 'false',
    redirect: false,
    subCategories: [],
    showDropDown: false,
  })

  const renderRedirect = () => {
    setData({ ...data, redirect: true })
  }

  const action = (
    <Button
      variant='light'
      size='small'
      onClick={(e) => {
        console.log(e)
        renderRedirect()
      }}>
      Open
    </Button>
  )

  /////

  const { categories, redirect, error, subCategories, showDropDown } = data

  const init = () => {
    getCategories().then((data) => {
      if (data.error) {
        setData({ ...data, error: data.error })
      } else {
        setData({ ...data, categories: data })
      }
    })
  }

  const loadSubCategories = (categoryId) => {
    getSubCategories(categoryId).then((res) => {
      if (res.error) {
        setData({ ...data, error: res.error })
      } else {
        setData({ ...data, subCategories: res })
      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  const handleMouse = (value, categoryId) => (event) => {
    if (value === 'enter') {
      loadSubCategories(categoryId)
      setData({ ...data, showDropDown: true })
    }
    if (value === 'leave') {
      setData({ ...data, showDropDown: false })
    }
  }

  //Snackbar
  const routes = ['/chat', '/chat/:sellerId']
  const { pathname } = useLocation()

  var isChatPage = matchPath(pathname, routes)?.path

  const { enqueueSnackbar } = useSnackbar()
  const showNotification = (message) => {
    console.log('here')
    uId = message.sender._id
    // variant could be success, error, warning, info, or default
    enqueueSnackbar('New Message from "' + message.sender.name + '"', { variant: 'success', autoHideDuration: 6000, action })
  }

  //Snackbar code Ends

  //Socket Start
  const handleOutputMessage = (msg) => {
    //console.log("Is chat page: ", isChatPage)
    if (!isChatPage && (msg?.room?.firstMember === authUser._id || msg?.room?.secondMember === authUser._id) && msg?.sender._id !== authUser._id) {
      showNotification(msg)
    }
  }
  const authUser = JSON.parse(localStorage.getItem('jwt'))?.user

  useEffect(() => {
    // as soon as the component is mounted, do the following tasks:
    // subscribe to socket events
    socket.on('outputMessage', handleOutputMessage)
    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off('outputMessage', handleOutputMessage)
    }
  }, [socket, handleOutputMessage])

  //Socket Ends

  return (
    <div className='page'>
      <Menu />
      <div className='my-3 container' style={{ borderRadius: '15px', backgroundColor: '#4da3be' }}>
        <div className='container-fluid row mx-0'>
          {categories &&
            categories.map((c, i) => (
              <Fragment>
                <Link
                  to={{ pathname: `/products/by/category/${c._id}`, param1: c.name }}
                  className='mx-3 my-2 expanded-font'
                  style={{ color: 'white', fontSize: '1rem', fontFamily: 'Arial', fontWeight: 'lighter' }}
                  key={i}>
                  <strong>{c.name}</strong>
                </Link>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              </Fragment>
            ))}
        </div>
      </div>

      <div className={className + ' content'}>{children}</div>
      {redirect && <Redirect to={{ pathname: '/chat', state: { data: uId } }} />}
      {/* {redirect && <Redirect to={{ pathname: '/chat/629cca2ac6b96fb2956ab8d8', state: { data: '123' } }} />} */}
    </div>
  )
}

export default Layout
