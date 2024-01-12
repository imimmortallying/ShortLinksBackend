
import * as E from 'fp-ts/Either';

export type EitherR<M> = E.Either<string, M>
export type EitherL<M> = E.Either<M, string>
export type EitherString = E.Either<string, string>

export const successWithMessage: (arg:string) => EitherString = (arg) => ({_tag:"Right", right: arg})
export const errorWithMessage: (arg:string) => EitherString = (arg) => ({_tag:"Left", left: arg})

