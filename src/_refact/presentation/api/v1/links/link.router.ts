import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { authService } from '../../../../application/auth';
import { StatusCodes } from '../../api.consts';
import { RequestWithBody } from '../../api.types';
import { validate } from '../../middlewares/api.middleware.validation';

import { linkService } from '../../../../application/links';
import { authMiddleware } from '../../../../../middleweres/authMiddleware';

const linkRouter = Router();

interface SendLinkDto { link: string, user: string, status: 'signedin' | 'anon' }


const sendLinkValidation = () => [
    body('link')
        .trim()
        .not()
        .isEmpty()
        .withMessage('link field is required'),
    body('link')
        .trim()
        .isURL()
        .withMessage('incorrect URL'),
    body('user')
        .trim()
        .not()
        .isEmpty()
        .withMessage('user field is required'),
    body('status')
        .trim()
        .not()
        .isEmpty()
        .withMessage('status field is required'),
]

linkRouter.post('/sendLink',
sendLinkValidation(), authMiddleware, validate,
    async (req: RequestWithBody<SendLinkDto>, res: Response) => {
        const linkAlias = await linkService.saveLink(req.body);

        return linkAlias._tag === 'Right'
            ? res.status(StatusCodes.OK).json({ alias: linkAlias.right })
            : res.status(StatusCodes.CONFLICT) // на уровне сервиса возврат ошибки не предусмотрен!

    }
);

interface AllLinksDto { user: string, status: 'signedin' | 'anon' }

linkRouter.post('/allUsersLinks',
authMiddleware, validate,
    async (req: RequestWithBody<AllLinksDto>, res: Response) => {
        const allUsersLinks = await linkService.findAllLinks(req.body);

        // тот же вопрос, что и при создании ссылки. Какие тут могут быть ошибочные сценарии и что возвращать клиенту?
        // сейчас возвращаю либо [], либо {alias:string}[]. Ошибки не предусмотрены
        return allUsersLinks._tag === 'Right'
            ? res.status(StatusCodes.OK).json({ links: allUsersLinks.right })
            : res.status(StatusCodes.NO_CONTENT)

    }
);

interface NewestLinkDto { user: string }


linkRouter.get('/findNewestLink',
authMiddleware, validate,
    async (req: Request, res: Response) => {

        const foundLink = await linkService.findNewestLink(req.body);

        return foundLink._tag === 'Right'
            ? res.status(StatusCodes.OK).json({ alias: foundLink.right })
            : res.status(StatusCodes.NO_CONTENT)

    }
);



export default linkRouter;
