import { Response, Router } from 'express';
import { body } from 'express-validator';
import { authService } from '../../../../application/auth';
import { StatusCodes } from '../../api.consts';
import { RequestWithBody } from '../../api.types';
import { validate } from '../../middlewares/api.middleware.validation';
import { matchI } from 'ts-adt';
import { AuthServiceError } from '../../../../application/auth/auth.service';

const authRouter = Router();

interface SignInDto { username: string, password: string, }

const signInValidator = () => [
    body('username')
        .trim().escape()
        .notEmpty()
        .withMessage('Username field is required')
        .isLength({ min: 3, max: 10 })
        .withMessage('Username length should be from 3 to 10 characters'),
    body('password')
        .trim().escape()
        .notEmpty()
        .withMessage('Password field is required')
        .isLength({ min: 3, max: 10 })
        .withMessage('Password length should be from 3 to 10 characters')
];

authRouter.post('/signin',
    signInValidator(), validate,
    async (req: RequestWithBody<SignInDto>, res: Response) => matchI(await authService.signIn(req.body))({
        success: () => {
            return res.status(StatusCodes.OK).json({ message: "User has been signed in" })
        },
        failure: ({ error }) => {
            if (error === AuthServiceError.UsernameIsTaken) {
                return res.status(StatusCodes.CONFLICT).json({ message: error });
            }

            return res.status(StatusCodes.INTERNAL).json({ message: "Unexpected error" });
        }
    })
);

interface LogInDto { username: string, password: string, }

authRouter.post('/login',
    async (req: RequestWithBody<LogInDto>, res: Response) => matchI(await authService.logIn(req.body))({
        success: () => {
            return res.status(StatusCodes.OK).json({ message: "User successful authorized" })
        },
        failure: ({ error }) => {
            if (error === AuthServiceError.UserDoesNotExist) {
                return res.status(StatusCodes.NOT_FOUND).json({ message: error });
            }

            if (error === AuthServiceError.CredentialFailure) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: error });
            }

            return res.status(StatusCodes.INTERNAL).json({ message: "Unexpected error" });
        }
    })
);

export default authRouter;
