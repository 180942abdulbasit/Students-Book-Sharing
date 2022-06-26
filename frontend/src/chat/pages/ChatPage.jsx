import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import moment from 'moment'
import axios from 'axios'
import { API } from '../../config'
import Layout from '../../core/Layout';

import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8002');

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: '100%',
    height: '80vh',
    borderRadius: '4px',
    border: '.1rem solid rgba(0,47,52,.2)',
    backgroundColor: '#fff'
  },
  headBG: {
      backgroundColor: '#e0e0e0'
  },
  borderRight500: {
      borderRight: '1px solid #e0e0e0'
  },
  messageArea: {
    height: '70vh',
    overflowY: 'auto'
  }
});

const Chat = (props) => {
  const classes = useStyles();
  let {sellerId} = useParams();
  
  const [users, setUsers] = useState([])
  const [room, setRoom] = useState({})
  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [sellerIdState, setSellerIdState] = useState(sellerId)
  

  
    let authUser = JSON.parse(localStorage.getItem('jwt')).user
    let data = props.location?.state?.data
  //console.log(data)
  
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(scrollToBottom, [messages]);

  const handleOutputMessage = (msg)=>{
    console.log("SOCKET-OUTPUT: ", msg)
    console.log("ROOM-FROM_SOCEKT:",room)
    if( msg?.room && (msg?.room?._id === room?._id)){
        setMessages(state=>[...state, msg])
        setNewMessage('')
    }
}

  useEffect(() => {
    // as soon as the component is mounted, do the following tasks:
    // subscribe to socket events
    socket.on("outputMessage", handleOutputMessage)

    return () => {
      // before the component is destroyed
      // unbind all event handlers used in this component
      socket.off("outputMessage", handleOutputMessage);
    };
  }, [socket, authUser._id, handleOutputMessage]);



  

  useEffect(()=>{
    const fetchData = async () =>{
      try {
        const {data} = await axios.get(`${API}/rooms/user-rooms`);
        const rooms = data.data
        const secondMembers = rooms.map((room)=>{
          if(room.messageCount>0){
            if(room?.firstMember._id!==authUser._id ){
              return room.firstMember
            }
            else if(room?.secondMember._id!==authUser._id){
              return room.secondMember
            }
          }
        })
        const uniqueUsers = secondMembers.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.place === value.place && t.name === value.name
          ))
        )
        
        setUsers(uniqueUsers)
        }catch(error){
            console.log(error)
        }
      }
      
      fetchData();

  
},[props])


  useEffect(() => {
          
    if(sellerId){
      getRoom(sellerId)
    }
    //If seller id is null, means no chat messages have been fetched, then fetch the messages for the first user in the secondmembers array
    // if(!sellerId){
    //   getRoomMessages(rooms[0]?._id)
    // }

    ////

    if(data){
      getRoom(data)
    }

    ///
  }, []);

  const getRoom = async(sellerId)=>{
      setSellerIdState(sellerId)
      const userIds = {firstMember:sellerId, secondMember:authUser._id}
      try {
        const {data} = await axios.post(`${API}/rooms`, userIds);
        setRoom(data.room)
        getRoomMessages(data.room._id)
        
        if(users.length<1){
          if(data.room.secondMember._id!==authUser._id){
            setUsers((state)=>[ data.room.secondMember])
          }
          else{
            setUsers((state)=>[ data.room.firstMember])
          }
        }
        // const secondUser = data.room.secondMember._id!==authUser._id ? data.room.secondMember : data.room.firstMember
        // if(!users.find(user => user._id === secondUser._id)){
        //   setUsers(state=>[...state, secondUser])
        // }

      } catch (error) {
        console.error(error);
      }
  }

  const getRoomMessages = async(roomId)=>{
    try {
      setMessagesLoading(true)
      const {data} = await axios.get(`${API}/rooms/${roomId}`);
      setMessages([...data.data.messages])
      setMessagesLoading(false)
    } catch (error) {
      setMessagesLoading(false)
      console.error(error);
    }
}

const messageEntered=(e)=>{
    if(e.key==='Enter'){
        sendMessage()
    }
}

const sendMessage = async()=>{
    //console.log("Entered: ", newMessage)
    if(newMessage!==''){
      socket.emit('inputMessage', {body:newMessage, room:room._id, sender:authUser._id});
    }
}


const getNamesFirstChar = (userObj)=>{  
  let chars = null
  if(userObj?.name?.toUpperCase()?.split(' ')[0]?.charAt(0)){
    chars = userObj?.name?.toUpperCase()?.split(' ')[0]?.charAt(0)
  }
  if(userObj?.name?.toUpperCase()?.split(' ')[1]?.charAt(0)){
    chars += userObj?.name?.toUpperCase()?.split(' ')[1]?.charAt(0)
  }
  return chars
}

//console.log(data)

  return (
    <Layout className='container-fluid col-md-10 offset-md-1' title='Student Book Sharing' description='Home Page to Student Book Sharing'>
      {data && console.log(data)}
      <div className='chat-container'>
        <Grid container>
            <Grid item xs={12} >
                <Typography variant="h4" className="header-message">Chat</Typography>
            </Grid>
        </Grid>
        <Grid container component={Paper} className={classes.chatSection}>
            <Grid item xs={3} className={classes.borderRight500}>
                <List className='current-user-chat-tile'>
                    <ListItem button key="RemySharp" >
                        <ListItemIcon>
                            <Avatar style={{backgroundColor:'black'}}>{authUser.name.toUpperCase().charAt(0)}</Avatar>
                        </ListItemIcon>
                        <ListItemText primary={authUser.name}></ListItemText>
                    </ListItem>
                </List>
                <Divider />
                <List >
                    <ListItem button key="RemySharp" >
                        {/* <ListItemText primary={authUser.name}>

                        </ListItemText> */}
                        <Typography variant="h5" className="inbox-heading">INBOX</Typography>
                    </ListItem>
                </List>
                <Divider />
                { users.length>0 ?
                <List style={{maxHeight: 550, overflow: 'auto'}}>

                  {/*  */}
                  { users &&  users.map( (user, index) => {
                          return (
                                <ListItem className={(room.firstMember?._id===user._id || room.secondMember?._id===user._id) ? 'active-chat' : ''} button key={user._id+'-'+index} onClick={()=>getRoom(user._id)}>
                                    <ListItemIcon>
                                        <Avatar style={{backgroundColor:'royalblue'}}>{getNamesFirstChar(user)}</Avatar>
                                    </ListItemIcon>
                                    <ListItemText primary={user.name }>{user.name}</ListItemText>
                                    {/* <ListItemText secondary="online" align="right"></ListItemText> */}
                                </ListItem>
                              ) 
                          })
                    }
                </List>
                  :
                  <div className='select-a-chat-container'>

                  <i class="fa-solid fa-comments fa-6x fa-chat-msg"></i>
                  <p className='chat-message-heading mt-4'>
                    No chats found.
                  </p>
                </div>
              }
            </Grid>
            <Grid item xs={9}>
                { ( messages?.length>0 ) ? 
                <List className={classes.messageArea} >
                    {messages && messages.map((message, index)=>{
                        return (
                            <ListItem key={message._id} ref={messagesEndRef}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <ListItemText className={message?.sender?._id===authUser._id ? 'right-msg' : 'left-msg' } primary={message?.body}></ListItemText>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ListItemText className={message?.sender?._id===authUser._id ? 'right-msg-time' : 'left-msg-time' } secondary={moment(message?.createdAt).format('dddd, MMMM Do YYYY, h:mm:ss a')}></ListItemText>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        )
                    }) }
                  </List>
                  :
                  (
                    (sellerIdState && !messagesLoading) ? 
                    <div className='select-a-chat-container'>

                    <i class="fa-solid fa-message fa-6x fa-chat-msg"></i>
                    <p className='chat-message-heading mt-4'>
                      This chat currently does not have any messages.
                    </p>
                  </div>
                      :
                      null
                  )
                    }
                    {
                      sellerIdState ? '' : <div className='select-a-chat-container'>

                      <i class="fa-solid fa-comments fa-6x fa-chat-msg"></i>
                      <p className='chat-message-heading mt-4'>
                        Select a chat to view conversation.
                      </p>
                    </div>
                    }
                <Divider />
                <Grid container  >
                    <Grid item xs={11}>
                        <TextField id="filled-basic" label="Type your message here ..." variant='filled' value={newMessage} fullWidth onKeyPress={messageEntered} onChange={e=>setNewMessage(e.target.value)}/>
                    </Grid>
                    <Grid xs={1} align="middle" style={{backgroundColor:"rgb(238, 238, 238)"}}>
                        <Fab  className='send-msg-btn' aria-label="add" onClick={sendMessage}><SendIcon className='send-msg-icon'/></Fab>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
      </div>
    </Layout>
  );
}

export default Chat;
