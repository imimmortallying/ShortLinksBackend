import express, { Request, Response } from 'express';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../../types/types';
import { UsersGetQueryModel } from '../model/UsersGetQueryModel';
import { UsersPostBodyModel } from '../model/UsersPostBodyModel';
import { UsersPutBodyModel } from '../model/UsersPutBodyModel';
import { UserResViewModel } from '../model/UserResViewModel';
import { UserUriIdString } from '../model/UserUriIdString';
import { body, check } from 'express-validator';
import { inputValidationMiddleware } from '../middleweres/inputValidationMiddleware';
import { usersRepository } from '../repositories/exmpUsersRepository';
import { usersLinksRepository } from '../repositories/usersLinksRepository';
import { authMiddleware } from '../middleweres/authMiddleware';



interface User {
    id: string, // как правильно описать?
    name: string,
    specialty: string,
}

enum HTTP_Statuses {
    OK_200 = 200,
    CREATED_201 = 201,
    NO_CONTENT_204 = 204,

    BAD_REQUEST_400 = 400,
    NOT_FOUND_404 = 404,
}


//! ошибки добавляются в массив, проверка работает корректно, но, если не указано name поле, то вернет сразу обе ошибки
const linkValidation = () => [
    body('link').trim().not().isEmpty().withMessage('link field is required'),
    body('link').trim().isURL().withMessage('incorrect URL'),
]
// export const getUsersRoutes = () => {

export const linksRouter = express.Router();


linksRouter.post('/api/sendLink',
    linkValidation(), inputValidationMiddleware,
    authMiddleware, 
    async (req: Request, res: Response) => {

        // достать строку из запроса
        // валидация токенов
        // или валидация фингерпринта
        // достать id юзера из локал стора или из куки?
        // по этому id сделать запрос в бд на другом слое
        try {
            const { link, authOrAnon } = req.body;
            console.log('isAuth: ', authOrAnon);
            if (authOrAnon === 'auth') {
                const userid = req.body.user.id;
                const newLinkInDB = await usersLinksRepository.pushLink(userid, link);
                return res.status(HTTP_Statuses.OK_200).json({ message: 'ссылка добавлена в массив' })
            }

            // если пользователь анонимный, то пушу ссылку в другую коллекцию
            if (authOrAnon === 'anon') {
                const { fingerprint } = req.body;
                const newLinkInDB = await usersLinksRepository.pushLink(fingerprint, link);
                return res.status(HTTP_Statuses.OK_200).json({ message: 'ссылка добавлена в массив анонимного пользователя' })
            }
            // console.log('userid:', userid)
            // тут я должен проверить, анонимный пользователь отправил ссылку или нет. В зависимости от этого либо в один либо в др репоз


            res.json('не понятно, анонимный или авторизованный пользователь')
        } catch (e) {
            console.log(e)
            res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "registration error" })
        }
    })

linksRouter.post('/redirect',
// в дальнейшем достать айпи, откуда переход
// добавить +1 count
// мидлваре?

// т.к. бд организована не оптимально, то, чтобы не проводить поиск каждого alias при переходе,
// в каждой из 2-х коллекций - анонимных и авториз. пользователей,
// при создании alias добавь символ 'a'(anon) или 'l'(logined) в начало alias, чтобы 
// в этом месте проверить наличие этого символа и сделать поиск по 1 из 2 коллекий в бд

// достать alias
// сделать поиск в бд
// вернуть полную ссылку если нашлась
// если нет, то какая-то ошибка, которая на фронте отобразит, что такой ссылки нет
async (req: Request, res: Response) => {
    try {
        console.log(req)
        const {alias} = req.body;
        const foundLink = await usersLinksRepository.findOriginalLink(alias);
        // console.log(foundLink)
        return res.json({foundLink});
    } catch (e) {
        console.log(e)
        res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "id link error" })
    }
}
)
