const express = require('express')
const connectToDB = require('./configDB')

const users = require('./routes/api/users')
const recipes = require('./routes/api/recipes')

require('dotenv').config()

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 3000
connectToDB()

app.use('/api/v1/users', users)
app.use('/api/v1/recipes', recipes)

app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`)
})
