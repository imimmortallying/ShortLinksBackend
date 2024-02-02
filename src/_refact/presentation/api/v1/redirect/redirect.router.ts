import { Request, Response, Router } from 'express';
// import { body } from 'express-validator';
import { StatusCodes } from '../../api.consts';
// import { RequestWithBody } from '../../api.types';
// import { validate } from '../../middlewares/api.middleware.validation';

import { linkService } from '../../../../application/links';
// import { authMiddleware } from '../../../../../middleweres/authMiddleware';

const redirectRouter = Router();

redirectRouter.get('/:alias',

    async (req: Request, res: Response) => {

        const visitorIp = req.socket.remoteAddress;
        const foundLink = await linkService.redirect({alias: req.params.alias, visitor: visitorIp});

        return foundLink._tag === 'Right'
            ? res.redirect(308, foundLink.right)
            : res.status(StatusCodes.NOT_FOUND)

        // return res.status(StatusCodes.OK).json({ alias: req.params.alias }) foundLink.right
        // return res.redirect(308, 'https://google.com')


    }

    
);



export default redirectRouter;
