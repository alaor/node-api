const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json())

mongoose.connect(process.env.DATABASE_URL, {dbName:'dito', useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('connected to database'))

const eventsRouter = require('./routes/events')
app.use('/events', eventsRouter)

app.listen(3000, () => console.log('server started'))