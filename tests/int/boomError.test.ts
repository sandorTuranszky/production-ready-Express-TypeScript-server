/* eslint-disable promise/catch-or-return, promise/always-return, promise/no-callback-in-promise */
import app from '../../src/app';
import * as request from 'supertest';

const pageNotFoundRoute = '/route-does-not-exists';

describe(`GET ${pageNotFoundRoute}`, () => {
  it('respond with an error decorated with Boom', async () => {
    const res = await request(app).get(pageNotFoundRoute);
    expect(res.body.isBoom).toBe(true);
  });
});
