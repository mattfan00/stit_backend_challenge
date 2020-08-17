const express = require('express'),
      router = express.Router(),
      db = require('../db.js'),
      bcrypt = require('bcrypt'),
      jwt = require('jsonwebtoken'),
      uuid = require('uuid'),
      config = require('config')

router.post('/register', async (req, res) => {
  let { username, password } = req.body
  
  try {
    if (!username || !password) throw Error('Missing username or password')

    if (db.get('users').find({username}).value()) throw Error('Username exists already')

    // Create hashed password and set the password to hashed password
    let hashedPassword = await bcrypt.hash(password, config.get('saltRounds'))
    if (!hashedPassword) throw Error('Error hashing password')
    password = hashedPassword

    let newUser = {
      id: uuid.v4(),
      username,
      password,
      favourite_ids: [],
      reservation_ids: []
    }

    // Push to database
    db.get('users')
      .push(newUser)
      .write()

    let returnUser = omitPassword(newUser)

    // Generate token for the user using the user id
    let token = jwt.sign({id: returnUser.id}, config.get('jwtSecret'))
    if(!token) throw Error('Error generating token')

    res.json({
      token,
      user: returnUser
    })
    
  } catch(e) {
    res.status(400).json({
      errorMessage: e.message
    })
  }
})

router.post('/login', async (req, res) => {
  let { username, password } = req.body

  try {
    if (!username || !password) throw Error('Missing username or password')

    let user = db.get('users').find({username}).value()
    if (!user) throw Error("Username doesn't exist")

    // Validate password
    let isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) throw Error('Incorrect password')

    // Generate token
    let token = jwt.sign({id: user.id}, config.get('jwtSecret'))
    if(!token) throw Error('Error generating token')

    user = omitPassword(user)

    res.json({
      token,
      user
    })
  } catch(e) {
    res.status(400).json({
      errorMessage: e.message
    })
  }
})


function omitPassword(user) { 
  const {password, ...returnUser} = user
  return returnUser
}

module.exports = router
