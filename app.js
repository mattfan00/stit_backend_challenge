const express = require('express'),
      app = express(),
      PORT = 3000,
      bodyParser = require('body-parser')

const UserRoutes = require('./routes/user.js'),
      IndexRoutes = require('./routes/index.js')

const validateUser = require('./middleware/auth.js')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(UserRoutes)
app.use(validateUser, IndexRoutes)

app.listen(PORT, () => {
  console.log('server started at port ' + PORT)
})