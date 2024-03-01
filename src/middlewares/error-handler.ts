import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { HttpException } from '@/exceptions/http.exception';

export function ErrorHandler(): ErrorRequestHandler {
  return async (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (res.headersSent) {
      return next(err);
    }

    console.log('Exception: ', err);

    if (err instanceof HttpException) {
      res.status(err.statusCode);
      return res.json({ message: err.message });
    }

    res.status(500);
    res.json({ message: `Unexpected error: ${err.message}` });
  }
}
