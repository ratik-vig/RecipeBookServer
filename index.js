const express = require('express')
const connectToDB = require('./configDB')

const users = require('./routes/api/users')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000
connectToDB()

app.use('/api/v1/users', users)

app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`)
})
