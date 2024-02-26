import { Request } from "express";

export type RequestWithParams<P> = Request<P>;

export type RequestWithQuery<P> = Request<object, object, object, P>;

export type RequestWithBody<P> = Request<object, object, P>;

export type RequestWithParamsAndBody<P, B> = Request<P, object, B>;
