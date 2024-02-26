import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator';
import { StatusCodes } from '../api.consts';

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    return res.status(StatusCodes.OK)
        .json({ errors: errors.array() });
}