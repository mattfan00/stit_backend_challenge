const config = require('config'),
      jwt = require('jsonwebtoken')

function validateUser(req, res, next) {
  const authString = req.headers['authorization']

  const token = authString && authString.split(' ')[1]
  if (!token) {
    return res.status(401).json({
      errorMessage: 'No token provided'
    }) 
  }

  const user = jwt.verify(token, config.get('jwtSecret'))

  req.user = user

  next()
}

module.exports = validateUser