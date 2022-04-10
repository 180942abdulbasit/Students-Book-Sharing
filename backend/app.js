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

//routes
const port = process.env.PORT || 8000 //accessing PORT variable from .env file

mongoose
  .connect(process.env.DATABASE, { useNewUrlParser: true })
  .then(() => console.log('DB Connected'))

mongoose.connection.on('error', (err) => {
  console.log(`DB connection error: ${err.message}`)
})

//server.timeout = 0;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
