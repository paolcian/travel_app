const app = require('../src/server/server.js') // Link to your server file
const supertest = require('supertest')
const request = supertest(app)


it('gets the test endpoint', async () => {
    const response = await request.get('/add')
  return response;
    expect(response.status).toBe(200)
  
  })