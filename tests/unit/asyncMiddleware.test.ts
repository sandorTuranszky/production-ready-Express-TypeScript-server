'use strict';

import * as boom from 'boom';
import asyncMiddleware from '../../src/utils/asyncMiddleware';

describe('Function asyncMiddleware', () => {
  const error = new Error('Error');
  const boomError = boom.badImplementation('Boom error');
  const successResponse = () =>
    // eslint-disable-next-line no-unused-vars
    new Promise((resolve, reject) => {
      setTimeout(() => resolve('Success!'), 100);
    });

  const errorResponse = (err: any) =>
    // eslint-disable-next-line no-unused-vars
    new Promise((resolve, reject) => {
      setTimeout(() => reject(err), 100);
    });

  const fn = async (req: any) => {
    const response = req.success
      ? await successResponse()
      : await errorResponse(req.boom ? boomError : error);
    return response;
  };

  describe('When successfully resolved', () => {
    test('should return with success message', async () => {
      expect.assertions(1);
      // @ts-ignore
      const response = await asyncMiddleware(fn)({ success: true }, null, null);
      expect(response).toBe('Success!');
    });
  });

  describe('When rejected', () => {
    test('should call next() with boomified error if boomified error was passed in as argument', async () => {
      const next = jest.fn();
      expect.assertions(2);
      // @ts-ignore
      await asyncMiddleware(fn)({ success: false, boom: true }, null, next);
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[0][0].isBoom).toBe(true);
    });

    test('should return next() with boomified error if Js (non boom) error was passed in as argument', async () => {
      const next = jest.fn();
      expect.assertions(2);
      // @ts-ignore
      await asyncMiddleware(fn)({ success: false, boom: false }, null, next);
      expect(next.mock.calls).toHaveLength(1);
      expect(next.mock.calls[0][0].isBoom).toBe(true);
    });
  });
});
