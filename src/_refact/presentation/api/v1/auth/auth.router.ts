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

//todo доделать валидацию всех роутов


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
        if (foundUser._tag === 'Right') {
            return res.status(StatusCodes.CONFLICT).json({ message: foundUser.right });
        } else {
            return res.status(StatusCodes.OK).json({ message: foundUser.left })
        }
    }
);

interface SignInDto { username: string, password: string, }

authRouter.post('/signin',
    async (req: RequestWithBody<SignInDto>, res: Response) => {
        // это не founduser
        const foundUser = await authService.createSession(req.body)

        return foundUser._tag === 'Left'
            ? res.status(StatusCodes.NOT_FOUND).json({ message: foundUser.left })
            : res
                .cookie('refreshToken', foundUser.right.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
                .json({ accessToken: foundUser.right.accessToken, user: { username: req.body.username } }) //в прошлой версии я возвращал еще и username. Сопоставить с фронтом
                .status(StatusCodes.OK)

        // добавить коллекцию токенов, чтобы проверить, работает ли модель, потом убрать отсюда
    }
);


authRouter.delete('/signout',
    async (req: Request, res: Response) => {
        // нужно ли проверять, что куки не пустые
        // в куки файле может быть много разных кук-строк, как с ними правильно работать?


        const deletedSession = await authService.deleteSession(req.cookies)

        return deletedSession._tag === "Left"
            ? res.status(StatusCodes.UNAUTHORIZED).json({ message: deletedSession.left })
            : res
                .clearCookie('refreshToken')
                .json({ message: deletedSession.right })
                .status(StatusCodes.OK)
    }
)

authRouter.get('/refresh',
    async (req: Request, res: Response) => {
        const { refreshToken } = req.cookies;
        const newSession = await authService.refreshSession(refreshToken);

        return newSession._tag === 'Right'
            ? res.cookie('refreshToken', newSession.right.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
                .json({ accessToken: newSession.right.accessToken, user: { username: newSession.right.username } }) //в прошлой версии я возвращал еще и username. Сопоставить с фронтом
                .status(StatusCodes.OK)
            : res.status(StatusCodes.UNAUTHORIZED).json({ message: newSession.left })
    }
)


export default authRouter;
