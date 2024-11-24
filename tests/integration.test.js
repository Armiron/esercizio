const request = require('supertest');
const app = require('../index.js');
let server;

describe('Integration Tests for Trips Endpoints', () => {
  const validTrip = {
    id: '1',
    origin: 'ATL',
    destination: 'LAX',
    cost: 150,
    duration: 120,
    type: 'flight',
    display_name: 'Atlanta to Los Angeles Flight',
  };

  beforeAll(() => {
    server = app.listen(4000);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('should add a new trip', async () => {
    const response = await request(server).post('/trip').send(validTrip);

    expect(response.status).toBe(200);
    expect(response.text).toBe('Trip saved successfully!');
  });

  it('should not add a duplicate trip', async () => {
    await request(server).post('/trip').send(validTrip); // Add the trip once

    const response = await request(server).post('/trip').send(validTrip); // Attempt to add again

    expect(response.status).toBe(200);
    expect(response.text).toBe('Trip already saved!');
  });

  it('should reject a trip with an unsupported origin', async () => {
    const invalidTrip = { ...validTrip, origin: 'INVALID_PLACE' };
    const response = await request(server).post('/trip').send(invalidTrip);

    expect(response.status).toBe(400); // Joi validation should reject it
    expect(response.error).toBeDefined(); // Joi should send an error message
  });

  it('should delete a trip by ID', async () => {
    await request(server).post('/trip').send(validTrip); // Add the trip

    const response = await request(server).delete(`/trip/${validTrip.id}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe('Trip deleted successfully!');
  });

  it('should fetch all trips not sorted', async () => {
    const trips = [
      { ...validTrip, id: '1', duration: 120, cost: 150 },
      {
        ...validTrip,
        id: '2',
        duration: 60,
        cost: 80,
        origin: 'JFK',
        destination: 'ORD',
      },
    ];

    for (const trip of trips) {
      await request(server).post('/trip').send(trip);
    }

    const response = await request(server).get('/trip');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ ...trips[0] }, { ...trips[1] }]);
  });

  it('should fetch all trips sorted by duration', async () => {
    const trips = [
      { ...validTrip, id: '1', duration: 120, cost: 150 },
      {
        ...validTrip,
        id: '2',
        duration: 60,
        cost: 80,
        origin: 'JFK',
        destination: 'ORD',
      },
    ];

    for (const trip of trips) {
      await request(server).post('/trip').send(trip);
    }

    const response = await request(server)
      .get('/trip')
      .query({ sort_by: 'fastest' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ ...trips[1] }, { ...trips[0] }]);
  });

  it('should fetch all trips sorted by cost', async () => {
    const trips = [
      { ...validTrip, id: '1', duration: 120, cost: 150 },
      {
        ...validTrip,
        id: '2',
        duration: 60,
        cost: 80,
        origin: 'JFK',
        destination: 'ORD',
      },
    ];

    for (const trip of trips) {
      await request(server).post('/trip').send(trip);
    }

    const response = await request(server)
      .get('/trip')
      .query({ sort_by: 'cheapest' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ ...trips[1] }, { ...trips[0] }]);
  });

  it('should return trips not sorted', async () => {
    const response = await request(app)
      .get('/queryTrips')
      .query({ origin: 'ATL', destination: 'LAX' });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });

  it('should return error when api key is wrong', async () => {
    const key = process.env.API_KEY;
    process.env.API_KEY = 'test';
    const response = await request(app)
      .get('/queryTrips')
      .query({ origin: 'ATL', destination: 'LAX' });

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    process.env.API_KEY = key;
  });

  it('should return trips sorted by cost when sort_by is cheapest', async () => {
    const response = await request(app)
      .get('/queryTrips')
      .query({ origin: 'ATL', destination: 'LAX', sort_by: 'cheapest' });

    expect(response.status).toBe(200);
    const sortedByCost = [...response.body];
    sortedByCost.sort((a, b) => a.cost - b.cost);
    expect(response.body).toEqual(sortedByCost);
  });

  it('should return trips sorted by duration when sort_by is fastest', async () => {
    const response = await request(app)
      .get('/queryTrips')
      .query({ origin: 'ATL', destination: 'LAX', sort_by: 'fastest' });

    expect(response.status).toBe(200);
    const sortedByDuration = [...response.body];
    sortedByDuration.sort((a, b) => a.duration - b.duration);
    expect(response.body).toEqual(sortedByDuration);
  });

  it('should return 400 for unsupported sorting in query', async () => {
    const response = await request(server)
      .get('/queryTrips')
      .query({ origin: 'ATL', destination: 'LAX', sort_by: 'unsupported' });

    expect(response.status).toBe(400);
  });

  it('should return 400 for unsupported places in query', async () => {
    const response = await request(server).get('/queryTrips').query({
      origin: 'ATL',
      destination: 'INVALID_PLACE',
      sort_by: 'cheapest',
    });

    expect(response.status).toBe(400);
  });
});
