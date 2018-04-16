const got = require('got');
const hapi = require('hapi');
const plugin = require('../src/plugins/ping.js');

jest.mock('got');

describe('ping', () => {
  let server;

  beforeAll(async () => {
    server = new hapi.Server();

    await server.register(plugin);
    return server.start();
  });

  afterAll(() => server.stop());

  it('performs an HTTP GET request', async () => {
    got.get.mockResolvedValue();

    const options = {
      url: '/ping?url=http://awesomefooland.com',
    };

    await server.inject(options);
    expect(got.get.mock.calls).toHaveLength(1);
    expect(got.get.mock.calls[0][0]).toBe('http://awesomefooland.com');
  });

  it('returns 404 response if package can not be found', async () => {
    const err = new Error('Some error');
    err.code = 404;
    got.get.mockRejectedValue(err);

    const options = {
      method: 'GET',
      url: '/ping?url=http://awesomefooland.com',
    };

    const response = await server.inject(options);
    expect(response.statusCode).toBe(404);
  });

  it('returns project url', async () => {
    got.get.mockResolvedValue();

    const options = {
      method: 'GET',
      url: '/ping?url=http://awesomefooland.com',
    };

    const response = await server.inject(options);
    expect(response.statusCode).toBe(200);
  });
});
