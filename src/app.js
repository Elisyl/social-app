const express = require('express')
const cors = require('cors')
const db = require('./db/mongoose')

const userRouter = require('../src/routes/user-routes')

const app = express()

app.use(express.json())
app.use(cors())

app.use(userRouter)


module.exports = app