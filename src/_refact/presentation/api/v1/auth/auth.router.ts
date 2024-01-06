import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { authService } from '../../../../application/auth';
import { StatusCodes } from '../../api.consts';
import { RequestWithBody } from '../../api.types';
import { validate } from '../../middlewares/api.middleware.validation';
import { matchI } from 'ts-adt';
import { AuthServiceError } from '../../../../application/auth/services/auth.service';

const authRouter = Router();

interface SignInDto { username: string, password: string, }

const signUpValidator = () => [
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

authRouter.post('/signup',
    signUpValidator(), validate,
    async (req: RequestWithBody<SignInDto>, res: Response) => {

        const foundUser = await authService.registerUser(req.body);
        // console.log('founduser:',foundUser)
        if (foundUser._tag === 'Right'){
            return res.status(StatusCodes.CONFLICT).json({ message: foundUser.right});
        } else {
            return res.status(StatusCodes.OK).json({ message:foundUser.left})
        }
    }
);
// authRouter.post('/signup',
//     signUpValidator(), validate,
//     async (req: RequestWithBody<SignInDto>, res: Response) => matchI(await authService.registerUser(req.body))({
//         success: () => {
//             return res.status(StatusCodes.OK).json({ message: "User has been signed in" })
//         },
//         failure: ({ error }) => {
//             if (error === AuthServiceError.UsernameIsTaken) {
//                 return res.status(StatusCodes.CONFLICT).json({ message: error });
//             }

//             return res.status(StatusCodes.INTERNAL).json({ message: "Unexpected error" });
//         }
//     })
// );

interface SignInDto { username: string, password: string, }

authRouter.post('/signin',
    async (req: RequestWithBody<SignInDto>, res: Response) => {
        const foundUser = await authService.createSession(req.body)
        console.log('founduser:',foundUser)
        if (foundUser._tag === 'Left'){
            return res.status(StatusCodes.NOT_FOUND).json({message:foundUser.left})
        }
        // return res.status(StatusCodes.OK).json({foundUser})
        return res.status(StatusCodes.OK).json({foundUser})
    }
);
// authRouter.post('/signin',
//     async (req: RequestWithBody<SignInDto>, res: Response) => matchI(await authService.createSession(req.body))({
//         success: () => {
//             return res.status(StatusCodes.OK).json({ message: "User successful authorized" })
//         },
//         failure: ({ error }) => {
//             if (error === AuthServiceError.UserDoesNotExist) {
//                 return res.status(StatusCodes.NOT_FOUND).json({ message: error });
//             }

//             if (error === AuthServiceError.CredentialFailure) {
//                 return res.status(StatusCodes.UNAUTHORIZED).json({ message: error });
//             }

//             return res.status(StatusCodes.INTERNAL).json({ message: "Unexpected error" });
//         }
//     })
// );

authRouter.delete('/signout',
    async (req: Request, res: Response) => {

    }
)

export default authRouter;
