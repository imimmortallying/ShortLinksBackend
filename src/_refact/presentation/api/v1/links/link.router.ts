import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { authService } from '../../../../application/auth';
import { StatusCodes } from '../../api.consts';
import { RequestWithBody } from '../../api.types';
import { validate } from '../../middlewares/api.middleware.validation';
import { matchI } from 'ts-adt';
import { AuthServiceError } from '../../../../application/auth/services/auth.service';
import { sessionValidation } from '../../middlewares/api.session.validation';
import { linkService } from '../../../../application/links';

const linksRouter = Router();

interface SignInDto { username: string, password: string, }

const linkValidation = () => [
    body('link')
        .trim()
        .not()
        .isEmpty()
        .withMessage('link field is required'),
    body('link')
        .trim()
        .isURL()
        .withMessage('incorrect URL'),
]

linksRouter.post('/sendLink',
    linkValidation(), validate, sessionValidation,
    async (req: RequestWithBody<SignInDto>, res: Response) => {

        const foundUser = await linkService

    }
);



export default linksRouter;
