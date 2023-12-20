import express, { Request, Response } from 'express';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../../types/types';
import { UsersPostBodyModel } from '../model/UsersPostBodyModel';
import { body, check } from 'express-validator';
import { inputValidationMiddleware } from '../middleweres/inputValidationMiddleware';
import { authRepository } from '../repositories/authRepository';
import { UserPostCreateBodyModel } from '../model/UserPostCreateBodyModel';
import { authMiddleware } from '../middleweres/authMiddleware';

const {secret} = require("../config");
const bcrypt = require('bcryptjs');


//jwt token
const jwt = require('jsonwebtoken');

// const generateAccessToken = (id:string) => {
//     const payload = {
//         id
//     }
    // payload - то, что содержит токен. sectet - ключ (рандомный?). Правильно ли его хранить тут просто файлом?
//     return jwt.sign(payload, secret, {expiresIn: '24h'})
// }

// класс с 2 токенами
const tokenService = require('../services/tokenService')

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
    body('username').trim().not().isEmpty().withMessage('Username field is required'),
    body('username').trim().isLength({ min: 3, max: 10 }).withMessage('Username length should be from 3 to 10 characters'),
]

const passwordValidation = () => [
    body('password').trim().not().isEmpty().withMessage('Password field is required'),
    body('password').trim().isLength({ min: 3, max: 10 }).withMessage('Password length should be from 3 to 10 characters')
]


export const authRouter = express.Router();


authRouter.post('/registration',
    nameValidation(), passwordValidation(), inputValidationMiddleware,
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

authRouter.post('/logout',
    async (req: Request, res: Response) => { 
        try {
            const {refreshToken} = req.cookies;
            // console.log(refreshToken)
            const token = await tokenService.removeTokenFromDB(refreshToken)
            res.clearCookie('refreshToken');
            return res.json(token)
        } catch (e) {
            console.log('ошибка при logout', e)
        } 
    })

authRouter.get('/refresh',
// в чем суть этого эндпоинта?
// это эндпоинт, переход на который будет происходить автоматически при истечении access токена?
// т.е каждые 30 минут будет res ошибка, которая автоматически перехватывается и создается новый токен?
//! я что-то понимаю неправильно. Это не может быть эндпоинт обновления access токена, потому что тут обновляются
// оба токена как при логине т.е. рефреш токен опять становится 30 дней. Значит, это все-таки эндпоинт, на который клиент должен попасть
// когда истекает 30 дней, чтобы автоматически проверить, был ли такой токен и валиден ли он, если да, то обновляю его
// и клиент опять имеет свежий токен на 30 дней, без необходимсоти повторной авторизации?

// но все-таки улби использует этот эндпоинт для того, чтобы перезаписать токены после истчения access токена. Но нахуя перезаписывать 
// и refresh токен? 
// если не обновлять всё пару, то 30 дней я смогу перезаписывать access токен, но через 30 дней должен буду входить в аккаунт заново
// если же я в течение 30 дней пользовался ресурсом, то мертвый access токен обновится, и не будет необходимсоти перезаходить в аккаунт
    async (req: Request, res: Response) => { 
        try {
            const {refreshToken} = req.cookies;
            if (!refreshToken){
                return res.json({message:'refresh, пользователь не авторизован, пустые cookie'});
            }
            const userData = tokenService.validateRefreshToken(refreshToken);
            // console.log('ищет по токену', refreshToken)
            const tokenFromDB = await tokenService.findTokenInDB(refreshToken);
            // console.log('нашел по токену', tokenFromDB)
            // если рефреш токен не прошел валидацию, значит истек его срок. Если токен не найден, значит не авторизован?
            // в любом случае необходима авторизация. Должен ли я в этот момент загрузить клиенту /login?
            if (!userData || !tokenFromDB) {
                return res.json({message:'refresh, пользователь не авторизован'});
            }
            // нахожу юзера в бд при помощи ID, которое достаю из токена. Если в бд автоматически что-то изменилось, например username,
            // то я это новое содержимое запишу в токен
            const foundUser = await authRepository.findUserById(userData.id);
            // создаю новую пару токенов, рефреш токен сохраняю в бд
            const tokens = tokenService.generateTokens({id:userData.id, username: foundUser[0].username});
            await tokenService.saveRefreshTokenInDB(userData.id, tokens.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true});
            

            return res.json({accessToken: tokens.accessToken, username:userData.username})
        } catch (e) {
            console.log('ошибка при refresh', e)
        } 
    })

authRouter.post('/login',
    nameValidation(), passwordValidation(), inputValidationMiddleware,
    async (req: RequestWithBody<UserPostCreateBodyModel>, res: Response) => { 
        try {
            const {username, password} = req.body;
            const foundUser = await authRepository.findUserByUsername(username);
            if (!foundUser.length) {
                return res.status(HTTP_Statuses.BAD_REQUEST_400).json(`Пользователь с именем ${username} не существует`)
            }
            // console.log(foundUser)
            //спопоставление пароля - того, что отправлен, с тем, что хранится в бд. Правильно ли делать ее тут, а не при помощи бд?
            const validPassword = bcrypt.compareSync(password, foundUser[0].password);
            if (!validPassword){
                return res.status(HTTP_Statuses.BAD_REQUEST_400).json({message: "Введен неправильный пароль"})
            }
            // const token = generateAccessToken(foundUser[0].id);
            const tokens = tokenService.generateTokens({id:foundUser[0].id, username:foundUser[0].username});
            // сохранение рефреш токена в коллекции токенов
            await tokenService.saveRefreshTokenInDB(foundUser[0].id, tokens.refreshToken)
            // сохранение рефреш токена в куки на 30 дней - срок как у самого токена
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly:true})
            res.json({accessToken: tokens.accessToken, username: foundUser[0].username});
        } catch (e) {
            console.log(e)
            res.status(HTTP_Statuses.BAD_REQUEST_400).json({message: "login error"})
        } 
    })

    // для проверки доступа анонимного/зарег пользователей
authRouter.get('/links',
    authMiddleware,
    async (req: RequestWithBody<UsersPostBodyModel>, res: Response) => {  
        try {
            res.json({links:'links'})
        } catch (e) {
            console.log(e)
            res.status(HTTP_Statuses.BAD_REQUEST_400).json({message: "some error"})
        }
    })
