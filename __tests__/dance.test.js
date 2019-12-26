require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');
const Dance = require('../lib/models/Dance');



describe('dance routes', () => {
  let exampleDance;

  beforeAll(() => {
    connect();
  });

  beforeEach(async() => {
    await mongoose.connection.dropDatabase();
    return exampleDance = await Dance.create({
      name: 'Vandals of Hammerwich',
      tradition: 'Litchfield'
    }); 
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('gets all dances', async() => {
    return request(app)
      .get('/api/v1/dance')
      .then(res => {
        return expect(res.body).toEqual(
          [
            {
              __v: 0,
              _id: expect.any(String),
              figures: [],
              name: 'Vandals of Hammerwich',
              tradition: 'Litchfield'
            }
          ] 
        );
      });
  });

  it('creates a dance if logged in', async() => {
    await User.create({
      email: 'test@test.com',
      password: 'password'
    });
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'password' });

    return agent
      .post('/api/v1/dance')
      .send({
        name: 'South Australia',
        tradition: 'Adderbury'
      })
      .then(res => {
        return expect(res.body).toEqual({
          _id: expect.any(String),
          figures: [],
          name: 'South Australia',
          tradition: 'Adderbury',
          __v: 0
        });
      });
  });

  it('fails to create a dance if not logged in', async() => {
    return request(app)
      .post('/api/v1/dance')
      .send({
        name: 'South Australia',
        tradition: 'Adderbury'
      })
      .then(res => {
        return expect(res.body).toEqual({
          message: 'jwt must be provided',
          status: 500
        });
      });
  });

  it('updates a dance if logged in', async() => {
    await User.create({
      email: 'test@test.com',
      password: 'password'
    });
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'password' });
    return agent
      .patch(`/api/v1/dance/${exampleDance.id}`)
      .send({
        name: 'Sherrif\'s Ride',
      })
      .then(res => {
        return expect(res.body).toEqual({
          _id: expect.any(String),
          figures: [],
          name: 'Sherrif\'s Ride',
          tradition: 'Litchfield',
          __v: 0
        });
      });
  });

  it('deletes a dance if logged in', async() => {
    await User.create({
      email: 'test@test.com',
      password: 'password'
    });
    const agent = request.agent(app);

    await agent
      .post('/api/v1/auth/login')
      .send({ email: 'test@test.com', password: 'password' });
    return agent
      .delete(`/api/v1/dance/${exampleDance.id}`)
      .then(res => {
        return expect(res.body).toEqual({
          _id: expect.any(String),
          figures: [],
          name: 'Vandals of Hammerwich',
          tradition: 'Litchfield',
          __v: 0
        });
      });
  });
});
