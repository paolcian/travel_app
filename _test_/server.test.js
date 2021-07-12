const app = require('../src/server/server.js') // Link to your server file
const supertest = require('supertest')
const request = require('supertest')

describe('Post Endpoints test', () => {
  it('gets the test endpoints', async () => {
    const res = await request(app)
      .get('/')
    expect(res.statusCode).toEqual(200);
  })
})