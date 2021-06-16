const mongoose = require('mongoose')
require('dotenv').config()

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    } catch (error) {
        console.log('error')
    }
}

module.exports = connectToDB

