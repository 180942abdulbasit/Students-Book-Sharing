const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser') //for extracting body messages from requests
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const expressValidator = require('express-validator')
const authRoutes = require('./routes/auth') //importing routes
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const subCategoryRoutes = require('./routes/subcategory')
const productRoutes = require('./routes/product')
const roomRoutes = require('./routes/room')
const reviewRoutes = require('./routes/review')

const { createMessageFromSocket } = require('./controllers/message')
const cors = require('cors')

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors()) //cors is used when frontend user requests from different ports.. cors handle it

//routes middleware
app.use('/api', authRoutes) //convention to use /api as prefix for all routes
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)
app.use('/api', subCategoryRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/reviews', reviewRoutes)

//routes
//const port = process.env.PORT || 8001 //accessing PORT variable from .env file

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true }).then(() => console.log('DB Connected'))

mongoose.connection.on('error', (err) => {
  console.log(`DB connection error: ${err.message}`)
})

const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
})

io.on('connection', function (socket) {
  console.log('a user connected')
  socket.on('disconnect', function () {
    console.log('User Disconnected')
  })

  //catch new message event
  socket.on('inputMessage', async function (data) {
    const newMessage = await createMessageFromSocket(data)
    io.emit('outputMessage', newMessage)
  })
})

io.listen(8002)

app.listen(5001, '0.0.0.0', (err) => {
  if (err) {
    console.log(err)
  }

  console.info('>>> 🌎 Open http://0.0.0.0:%s/ in your browser.', 5000)
})
