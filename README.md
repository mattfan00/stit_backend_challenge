# STIT Backend Challenge

This is my submission for the STIT Backend Challenge.

## Usage/Configuration
1. Use `npm install` to install dependencies 
1. This project utilizes a `config` file to store the Yelp API keys, JWT secret, and salt rounds for `bcrypt` to hash the password. Create a directory called `config` and a file called `default.json` within it. Below is an example of the contents in `default.json`

      ```js
      {
        "saltRounds": 10,
        "jwtSecret": "this is my secret",
        "yelpKey": "your_api_key"
      }
      ```

1. Use `node app.js` to start the server or `npm run dev` to start the server using `nodemon`

## Endpoints
User-related: 
- `/register` - receives username and password and returns created user
- `/login` - receives username and password and returns the user details and the JWT token which is needed in every request header to the other endpoints for authentication purposes

Other:
- `/setFavourite` - receives the ID of the restaurant you want to favorite and returns the list of all of your favorited restaurants 
- `/unsetFavourite` - receives the ID of the restaurant you want to remove from your favorites and returns the list of all of your favorited restaurants 
- `/get_businesses` - receives the location that you want to search for restaurants (if not specified then searches 'NYC') and returns a call from the Yelp API using that location
- `/reserve` - receives the ID of the restaurant you want to make a reservation at and returns the details of that reservation

**An important note** when sending requests to the endpoints listed in "Other" is to always send the JWT returned from the `/login` endpoint in the request header to indicate that the user is signed in. The required format for this is: `"Authorization": "Bearer your_jwt_token"`

There is no `/logout` endpoint since the client side could choose not to send the JWT to indicate that the user is no longer signed in. 