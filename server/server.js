const express= require('express')
const dotenv =require('dotenv')
const morgan = require('morgan')
const cors = require('cors')
require('./congigure/db')
const authRoutes = require('./routes/authRoure')
const productRoutes = require('./routes/productRoutes')

// configure env
dotenv.config()


const app = express()

// middlewares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// routes
app.use(authRoutes)
app.use(productRoutes)

// rest api
app.get('/',(req,res) => {
    res.send(`<h1>Welcome to ecommerce app</h1>`)
})

// port
const port = 8080

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})