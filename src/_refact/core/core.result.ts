import { ADT } from "ts-adt";

// export type Either<E> = ADT<{ success: { }; failure: { error: E }; }>;

// export type EitherV<V, E> = ADT<{ success: { value: V }; failure: { error: E }; }>;

// export const success: () => Either<never> = () => ({ _type: "success", });

// export const failure: (error: string) => Either<string> = (error) => ({ _type: "failure", error, });

// export const failureE: <E>(error: E) => Either<E> = (error) => ({ _type: "failure", error, });


import * as E from 'fp-ts/Either';

export type EitherR<M> = E.Either<string, M>
export type EitherMessage = E.Either<string, string>

export const successWithMessage: (arg:string) => EitherMessage = (arg) => ({_tag:"Right", right: arg})
export const errorWithMessage: (arg:string) => EitherMessage = (arg) => ({_tag:"Left", left: arg})

