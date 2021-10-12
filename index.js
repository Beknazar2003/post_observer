const express = require('express')
const cors = require('cors')
const router = require('./routes/index')
const db = require('./db')
const bodyParser = require('body-parser')
const app = express()

const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use(bodyParser())
app.use(router)

db.connect().then(() => {
  app.listen(PORT, () => console.log('sever has been started on port', PORT))
})
.catch(e => {
  client.release()
  console.error('query error', e.message, e.stack)
})


module.exports = app