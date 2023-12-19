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
// как вернуть только 1 и нужно ли?
const nameValidation = () => [
    body('name').trim().not().isEmpty().withMessage('Name fields is required'),
    body('name').trim().isLength({ min: 3, max: 10 }).withMessage('Name length should be from 3 to 10 characters')
]
// export const getUsersRoutes = () => {

export const linksRouter = express.Router();

// id URI не типизирую - всегда строка. Потом все-таки типизировал, чтобы унифицировать 
linksRouter.post('/sendLink',
    // добавить валидацию инпута - URL
    authMiddleware,
    async (req: Request, res: Response) => {

        // достать строку из запроса
        // валидация токенов
        // достать id юзера из локал стора или из куки?
        // по этому id сделать запрос в бд на другом слое
        try {
            const { link, authOrAnon } = req.body;
            console.log('isAuth: ', authOrAnon);
            if (authOrAnon === 'auth') {
                const userid = req.body.user.id;
                const newLinkInDB = await usersLinksRepository.pushLink(userid, link);
                return res.status(HTTP_Statuses.OK_200).json({message: 'ссылка добавлена в массив'})
            }

            // если пользователь анонимный, то пушу ссылку в другую коллекцию
            if (authOrAnon === 'anon'){
                const {userFingerprint} = req.body
                return res.json({message:'аноним'})
            }
            // console.log('userid:', userid)
            // тут я должен проверить, анонимный пользователь отправил ссылку или нет. В зависимости от этого либо в один либо в др репоз


            res.json('не понятно, анонимный или авторизованный пользователь')
        } catch (e) {
            console.log(e)
            res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "registration error" })
        }
    })

linksRouter.get('/allLinks',

)

