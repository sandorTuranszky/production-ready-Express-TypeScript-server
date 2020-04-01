'use strict';

import { logger as winston } from '../../src/utils/logger/winston';

import {
  exitProcess,
  uncaughtExceptionHandler,
  errorDecorator,
  finalErrorHandler,
  unhandledRejectionHandler,
} from '../../src/utils/errorMiddleware';

describe('Helper function "exitProcess" from errorMiddleware', () => {
  describe('When called', () => {
    test('should exit process with "1" as argument', () => {
      // @ts-ignore
      const exit = jest.spyOn(process, 'exit').mockImplementation(number => number);
      exitProcess();
      expect(exit).toHaveBeenCalledWith(1);
      exit.mockRestore();
    });
  });
});

describe('Error handlers from errorMiddleware', () => {
  describe('Function unhandledRejectionHandler', () => {
    test('should call "winston.error" with "reason", "message" and "p" arguments', () => {
      // @ts-ignore
      const error = jest.spyOn(winston, 'error').mockImplementation(value => value);
      const reason = new Error('Unhandled Promise Rejection Error');
      const p = {};
      // @ts-ignore
      unhandledRejectionHandler(reason, p);
      expect(error).toHaveBeenCalledWith({ reason, message: 'Unhandled Rejection at Promise', p });
      error.mockRestore();
    });
  });

  describe('Function uncaughtExceptionHandler', () => {
    test('should call "winston.error" with "err" as an argument', () => {
      // @ts-ignore
      const error = jest.spyOn(winston, 'error').mockImplementation(value => value);
      // @ts-ignore
      const exit = jest.spyOn(process, 'exit').mockImplementation(number => number);
      const err = new Error('Error');
      uncaughtExceptionHandler(err);
      expect(error).toHaveBeenCalledWith(err);
      error.mockRestore();
      exit.mockRestore();
    });

    test('should call process.exit with exit code 1', () => {
      // @ts-ignore
      const error = jest.spyOn(winston, 'error').mockImplementation(value => value);
      // @ts-ignore
      const exit = jest.spyOn(process, 'exit').mockImplementation(number => number);
      uncaughtExceptionHandler(null);
      expect(exit).toHaveBeenCalledWith(1);
      error.mockRestore();
      exit.mockRestore();
    });
  });

  describe('Function errorDecorator', () => {
    const req = {
      originalUrl: 'https://www.test.com',
      method: 'GET',
      ip: '127.0.0.1',
    };

    describe('Value for "err.isDeveloperError" property', () => {
      const res = { headersSent: false };
      describe('If already defined on error object', () => {
        const err = new Error('Some error');
        const next = jest.fn(() => err);

        test('should not change if set to "true"', () => {
          // @ts-ignore
          err.isDeveloperError = true;
          // @ts-ignore
          errorDecorator(err, req, res, next);
          // @ts-ignore
          expect(err.isDeveloperError).toBe(true);
        });

        test('should not change if set to "false"', () => {
          // @ts-ignore
          err.isDeveloperError = false;
          // @ts-ignore
          errorDecorator(err, req, res, next);
          // @ts-ignore
          expect(err.isDeveloperError).toBe(false);
        });
      });

      describe('If not defined on error object', () => {
        describe('And status code does not exists', () => {
          const err = new Error('Some error');
          // @ts-ignore
          err.statusCode = null;
          const next = jest.fn(() => err);
          // @ts-ignore
          errorDecorator(err, req, res, next);

          test('should set "err.isDeveloperError" value to "true"', () => {
            // @ts-ignore
            expect(err.isDeveloperError).toBe(true);
          });
        });

        describe('And status code is >=500 and stack trace is available', () => {
          const err = new Error('Some error');
          // @ts-ignore
          err.statusCode = 500;
          const next = jest.fn(() => err);
          // @ts-ignore
          errorDecorator(err, req, res, next);

          test('should set "err.isDeveloperError" value to "true"', () => {
            // @ts-ignore
            expect(err.isDeveloperError).toBe(true);
          });
        });

        describe('And status code is >=500 and stack trace is not available', () => {
          const err = new Error('Some error');
          // @ts-ignore
          err.statusCode = 500;
          delete err.stack;
          const next = jest.fn(() => err);
          // @ts-ignore
          errorDecorator(err, req, res, next);

          test('should set "err.isDeveloperError" value to "false"', () => {
            // @ts-ignore
            expect(err.isDeveloperError).toBe(false);
          });
        });

        describe('And stack trace is available and status code is <500', () => {
          const err = new Error('Some error');
          // @ts-ignore
          err.statusCode = 400;
          const next = jest.fn(() => err);
          // @ts-ignore
          errorDecorator(err, req, res, next);

          test('should set "err.isDeveloperError" value to "false"', () => {
            // @ts-ignore
            expect(err.isDeveloperError).toBe(false);
          });
        });
      });
    });

    describe('When decorating', () => {
      const err = new Error('Some error');
      const res = { headersSent: false };
      const next = jest.fn(() => err);
      // @ts-ignore
      errorDecorator(err, req, res, next);

      test('should add "originalUrl" prop', () => {
        // @ts-ignore
        expect(err.originalUrl).toBe(req.originalUrl);
      });

      test('should add "method" prop', () => {
        // @ts-ignore
        expect(err.method).toBe(req.method);
      });

      test('should add "ip" prop', () => {
        // @ts-ignore
        expect(err.ip).toBe(req.ip);
      });
    });
  });

  describe('Function finalErrorHandler', () => {
    describe('When "headersSent" is "true"', () => {
      const err = new Error('Some error');
      const res = { headersSent: true };

      test('should call next() with error object', () => {
        const next = jest.fn();
        // @ts-ignore
        finalErrorHandler(err, {}, res, next);
        expect(next).toHaveBeenCalledWith(err);
      });

      test('should return with function "next()" with error object. No code execution after "if (res.headersSent) return next(err);"', () => {
        const next = jest.fn(() => err);
        // @ts-ignore
        expect(finalErrorHandler(err, {}, res, next)).toBe(err);
      });
    });

    describe('When it is a developer error and not a server error', () => {
      const res = {
        headersSent: false,
        json() {},
        status() {
          return this;
        },
      };
      test('should call "winston.error" with "err" as an argument', () => {
        const err = new Error('Some error');
        // @ts-ignore
        err.isDeveloperError = true;
        // @ts-ignore
        err.isServer = false;
        // @ts-ignore
        const error = jest.spyOn(winston, 'error').mockImplementation(value => value);
        // @ts-ignore
        const exit = jest.spyOn(process, 'exit').mockImplementation(number => number);
        // @ts-ignore
        finalErrorHandler(err, {}, res, {});
        expect(error).toHaveBeenCalledWith(err);
        error.mockRestore();
        exit.mockRestore();
      });

      test('should call process.exit with exit code 1', () => {
        const err = new Error('Some error');
        // @ts-ignore
        err.isDeveloperError = true;
        // @ts-ignore
        err.isServer = true;
        // @ts-ignore
        const exit = jest.spyOn(process, 'exit').mockImplementation(number => number);
        // @ts-ignore
        const error = jest.spyOn(winston, 'error').mockImplementation(value => value);
        // @ts-ignore
        finalErrorHandler(err, {}, res, {});
        expect(exit).toHaveBeenCalledWith(1);
        exit.mockRestore();
        error.mockRestore();
      });
    });
  });
});
