/* eslint-disable promise/catch-or-return, promise/always-return, promise/no-callback-in-promise */

import app from '../../src/app';
import * as request from 'supertest';

const pageNotFoundRoute = '/route-does-not-exists';

describe(`GET ${pageNotFoundRoute}`, () => {
  it('respond with json', done => {
    request(app)
      .get(pageNotFoundRoute)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(404, done);
  });

  it('respond with 404 statusCode and "Not Found" message', done => {
    request(app)
      .get(pageNotFoundRoute)
      .expect(404)
      .then(res => {
        expect(res.body.output.statusCode).toBe(404);
        expect(res.body.output.payload.message).toBe('Not Found');
        done();
      });
  });

  it('respond with a non server error', done => {
    request(app)
      .get(pageNotFoundRoute)
      .then(res => {
        expect(res.body.isServer).toBe(false);
        expect(res.body.output.statusCode).toBeLessThan(500);
        done();
      });
  });

  it('respond with a non developer error', done => {
    request(app)
      .get(pageNotFoundRoute)
      .then(res => {
        expect(res.body.isDeveloperError).toBe(false);
        done();
      });
  });

  it('respond with an error with additional information: "originalUrl", "method", "ip"', done => {
    request(app)
      .get(pageNotFoundRoute)
      .expect(404)
      .then(res => {
        expect(res.body.originalUrl).toBe(pageNotFoundRoute);
        expect(res.body.method).toBe('GET');
        expect(res.body.ip).toBeDefined();
        done();
      });
  });
});
