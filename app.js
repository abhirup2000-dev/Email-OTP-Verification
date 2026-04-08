const express = require('express')
const app = express()
const helmet = require('helmet')
const morgan = require('morgan')
const RateLimit = require('./app/utils/limiter')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const DatabaseConnect = require('./app/config/dbcon')
DatabaseConnect()

app.use(morgan('dev'))
app.use(helmet())
app.use(RateLimit)



app.use('/api/v1',require('./app/routes/index'))

const port = 3009

app.listen(port, ()=>{
  console.log(`server running on http://localhost:${port}`)
})