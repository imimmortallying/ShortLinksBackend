import { Request } from "express";

export type RequestWithParams <P> = Request<P>
export type RequestWithQuery <P> = Request<{},{},{}, P>
export type RequestWithBody <P> = Request<{},{},P>
export type RequestWithParamsAndBody <P, B> = Request<P,{},B>
