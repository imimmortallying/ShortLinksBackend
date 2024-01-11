import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { authService } from '../../../../application/auth';
import { StatusCodes } from '../../api.consts';
import { RequestWithBody } from '../../api.types';
import { validate } from '../../middlewares/api.middleware.validation';
import { matchI } from 'ts-adt';
import { AuthServiceError } from '../../../../application/auth/services/auth.service';
import { linkService } from '../../../../application/links';
import { authMiddleware } from '../../../../../middleweres/authMiddleware';

const linkRouter = Router();

interface SignInDto { link: string, user: string, status: 'signedin' | 'anon'}

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

linkRouter.post('/sendLink',
    linkValidation(), authMiddleware, validate, 
    async (req: RequestWithBody<SignInDto>, res: Response) => {
        const foundUser = await linkService.saveLink(req.body)
        return res.status(StatusCodes.OK).json({ message: 'LINK' })
    }
);



export default linkRouter;
