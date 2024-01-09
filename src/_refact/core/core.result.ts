
import * as E from 'fp-ts/Either';

export type EitherR<M> = E.Either<string, M>
export type EitherMessage = E.Either<string, string>

export const successWithMessage: (arg:string) => EitherMessage = (arg) => ({_tag:"Right", right: arg})
export const errorWithMessage: (arg:string) => EitherMessage = (arg) => ({_tag:"Left", left: arg})

