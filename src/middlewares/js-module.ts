import { sync as lookupDir } from 'fast-glob';
import { stat as getFileStat } from 'fs/promises';

import { NextFunction, Request, Response } from 'express';

export function JsModule(baseURL: string) {
  const depsDirs = lookupDir(`${baseURL}/**/*.js`, {
    onlyFiles: true,
  });

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const module = depsDirs.find((dir) =>
      dir.includes(req.originalUrl)
    );

    // If not dependency - ignore
    if (!module) {
      return next();
    }

    const maybeFile = await getFileStat(module);

    // If not file - ignore
    if (!maybeFile.isFile()) {
      return next();
    }

    res.sendFile(module);
  }
}
