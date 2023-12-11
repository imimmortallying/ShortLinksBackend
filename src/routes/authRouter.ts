import express, { Request, Response } from 'express';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../../types/types';
import { UsersPostBodyModel } from '../model/UsersPostBodyModel';
import { body, check } from 'express-validator';
import { inputValidationMiddleware } from '../middleweres/inputValidationMiddleware';
import { authRepository } from '../repositories/authRepository';
import { UserPostCreateBodyModel } from '../model/UserPostCreateBodyModel';

const bcrypt = require('bcryptjs')

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

const nameValidation = () => [
    body('name').trim().not().isEmpty().withMessage('Name fields is required'),
    body('name').trim().isLength({ min: 3, max: 10 }).withMessage('Name length should be from 3 to 10 characters')
]


export const authRouter = express.Router();


authRouter.post('/registration',
    // nameValidation(), inputValidationMiddleware,
    async (req: RequestWithBody<UserPostCreateBodyModel>, res: Response) => {  
        try {
            const {username, password} = req.body;
            //верну либо юзера, либо пустой массив - проверка на наличие юзера в базе
            const isUserRegistred = await authRepository.checkIsUserRegistred(username)
            if (isUserRegistred.length) {
                return res.status(HTTP_Statuses.BAD_REQUEST_400).json('Пользователь с таким именем уже существует')
            }
            //если в бд юзера нет, то создаем. Пароль шифруем
            const hashPassword = bcrypt.hashSync(password, 7);
            const newUser = {
                username: username,
                password: hashPassword,
                id: crypto.randomUUID(),
            }
            await authRepository.createNewUser(newUser)
            res.json('Пользователь успешно зарегистрирован')
        } catch (e) {
            console.log(e)
            res.status(HTTP_Statuses.BAD_REQUEST_400).json({message: "registration error"})
        }
    })

authRouter.post('/login',
    nameValidation(), inputValidationMiddleware,
    async (req: RequestWithBody<UsersPostBodyModel>, res: Response) => { 
        try {

        } catch (e) {
            console.log(e)
            res.status(HTTP_Statuses.BAD_REQUEST_400).json({message: "login error"})
        } 
    })

    // для проверки доступа анонимного/зарег пользователей
authRouter.get('/allUsers',
    // nameValidation(), inputValidationMiddleware,
    async (req: RequestWithBody<UsersPostBodyModel>, res: Response) => {  
        try {
            res.json('allusers work')
        } catch (e) {
            console.log(e)
            res.status(HTTP_Statuses.BAD_REQUEST_400).json({message: "some error"})
        }
    })

