// make our .env variables available via process.env
require('dotenv').config()
// import mongoose
const mongoose = require('mongoose')

// connect to the database
// Local database connection=process.env.DATABASE_URL
// Remote database connection=process.env.MONGODB_URI
mongoose.connect(process.env.MONGODB_URI, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
})

// save the connection in a variable
const db = mongoose.connection

// create some notification
db.on('open', () => console.log(`Mongoose connected to ${mongoose.connection.host}:${mongoose.connection.port}`))
db.on('close', () => console.log(`Mongoose disconnected to ${mongoose.connection.host}:${mongoose.connection.port}`))
db.on('error', (error) => console.log(error))

// export the connection
module.exports = mongoose
