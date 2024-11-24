const express = require('express');
var bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
app.use(bodyParser.json());
const validator = require('express-joi-validation').createValidator({});
const {
  tripSchema,
  tripsQuerySchema,
  tripDeleteSchema,
  tripGetSchema,
} = require('./schemas/tripSchemas.js');
const dotenv = require('dotenv');
dotenv.config();

const port = 3000;

app.get('/queryTrips', validator.query(tripsQuerySchema), async (req, res) => {
  const { origin, destination, sort_by } = req.query;
  let response = [];
  try {
    const { data } = await axios.get(
      'https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips',
      {
        params: {
          origin,
          destination,
        },
        headers: {
          'x-api-key': process.env.API_KEY,
        },
      }
    );

    switch (sort_by) {
      case 'fastest':
        response = data.sort((a, b) => a.duration - b.duration);
        break;
      case 'cheapest':
        response = data.sort((a, b) => a.cost - b.cost);
        break;
      default:
        break;
    }
    res.send(response);
  } catch (error) {
    res.send(error.message);
  }
});

// Bonus (saved in memory to avoid having to run mongo)
let trips = [];

app.post('/trip', validator.body(tripSchema), (req, res) => {
  const trip = req.body;
  try {
    if (!trips.find((elem) => elem.id === trip.id)) {
      trips.push(trip);
      res.send('Trip saved successfully!');
    }
    res.send('Trip already saved!');
  } catch (error) {
    res.send(error.message);
  }
});

app.get('/trip', validator.query(tripGetSchema), (req, res) => {
  const { sort_by } = req.query;
  let response = [];
  try {
    switch (sort_by) {
      case 'fastest':
        response = trips.sort((a, b) => a.duration - b.duration);
        break;
      case 'cheapest':
        response = trips.sort((a, b) => a.cost - b.cost);
        break;
      default:
        response = trips;
        break;
    }
    res.send(response);
  } catch (error) {
    res.send(error.message);
  }
});

app.delete('/trip', validator.query(tripDeleteSchema), (req, res) => {
  const { id } = req.query;
  try {
    trips = trips.filter((trip) => trip.id != id);
    res.send('Trip deleted successfully!');
  } catch (error) {
    res.send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
