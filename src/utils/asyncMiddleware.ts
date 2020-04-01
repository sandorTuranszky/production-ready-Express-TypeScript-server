/* eslint-disable consistent-return, promise/no-callback-in-promise */
import * as boom from 'boom';
import { Request, Response, NextFunction } from 'express';

/**
 * Wrapper for our async route handlers
 * @param {*} fn
 */
const asyncMiddleware = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> =>
  Promise.resolve(fn(req, res, next)).catch(err => {
    if (!err.isBoom) return next(boom.badImplementation(err));
    next(err);
  });

export default asyncMiddleware;
