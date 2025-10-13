import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Wraps an async handler to catch errors and pass them to Express error handling
 */
export function asyncHandler(fn: (...args: any[]) => Promise<any>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next))
      .then((result) => {
        if (result !== undefined && !res.headersSent) {
          res.json(result)
        }
      })
      .catch(next)
  }
}
