const express = require('express'),
      router = express.Router(),
      config = require('config'),
      axios = require('axios'),
      db = require('../db.js'),
      uuid = require('uuid')


router.post('/setFavourite', (req, res) => {
  let { id } = req.body

  if (!id) {
    return res.status(400).json({
      errorMessage: 'No restaurant ID was given'
    })
  }

  let currFavs = db.get('users')
    .find({id: req.user.id})
    .get('favourite_ids')
    .value()
  
  if (!currFavs.includes(id)) {
    currFavs.push(id)
    db.get('users')
      .find({id: req.user.id})
      .assign({favourite_ids: currFavs})
      .write()
  }

  res.json(currFavs)
})

router.post('/unsetFavourite', (req, res) => {
  let { id } = req.body

  if (!id) {
    return res.status(400).json({
      errorMessage: 'No restaurant ID was given'
    })
  }

  db.get('users')
    .find({id: req.user.id})
    .get('favourite_ids')
    .pull(id)
    .write()

  res.json(db.get('users').find({id: req.user.id}).get('favourite_ids'))
})

router.post('/get_businesses', (req, res) => {
  let { location } = req.body 

  if (!location) {
    location = 'NYC'
  }

  location = location.replace(' ', '+')

  let yelpURL = 'https://api.yelp.com/v3/businesses/search?term=restaurants&location=' + location

  axios({
    method: 'GET', 
    url: yelpURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + config.get('yelpKey') 
    } 
  })
    .then(result => {
      res.json(result.data)
    })
    .catch(e => {
      res.status(400).json({
        errorMessage: 'API call failed'
      })
    })
})

router.post('/reserve', async (req, res) => {
  try {
    let currReservations = db.get('users')
      .find({id: req.user.id})
      .get('reservation_ids')
      .value()
    
    console.log(currReservations)

    if (currReservations.length >= 3) throw Error('Cannot make more than 3 reservations') 

    let { id } = req.body
    if (!id) throw Error('No restaurant ID was given')

    let statuses = ['SUCCESS', 'FAILURE', 'PENDING']
    let newReservation = {
      id: uuid.v4(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      user_id: req.user.id,
      business_id: id 
    }

    // add reservation to reservations list
    db.get('reservations')
      .push(newReservation)
      .write()

    if (newReservation.status == "SUCCESS") {
      // add reservation ID to the users list
      db.get('users')
        .find({id: req.user.id})
        .get('reservation_ids')
        .push(newReservation.id)
        .write()
    }

    res.json(newReservation)
  } catch(e) {
    res.status(400).json({
      errorMessage: e.message
    })
  }
})


module.exports = router
