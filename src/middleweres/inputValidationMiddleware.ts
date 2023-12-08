import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator';

export const inputValidationMiddleware = (req:Request, res: Response, next: NextFunction) => {
    const resultErrors = validationResult(req);
    if (!resultErrors.isEmpty()) {
      res.status(400).json({ errors: resultErrors.array()})
    } else {
        next();
    }
}