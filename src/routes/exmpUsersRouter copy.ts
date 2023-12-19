// import express, { Request, Response } from 'express';
// import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../../types/types';
// import { UsersGetQueryModel } from '../model/UsersGetQueryModel';
// import { UsersPostBodyModel } from '../model/UsersPostBodyModel';
// import { UsersPutBodyModel } from '../model/UsersPutBodyModel';
// import { UserResViewModel } from '../model/UserResViewModel';
// import { UserUriIdString } from '../model/UserUriIdString';
// import { body, check } from 'express-validator';
// import { inputValidationMiddleware } from '../middleweres/inputValidationMiddleware';
// import { usersRepository } from '../repositories/exmpUsersRepository';



// interface User {
//     id: string, // как правильно описать?
//     name: string,
//     specialty: string,
// }

// enum HTTP_Statuses {
//     OK_200 = 200,
//     CREATED_201 = 201,
//     NO_CONTENT_204 = 204,

//     BAD_REQUEST_400 = 400,
//     NOT_FOUND_404 = 404,
// }


// //! ошибки добавляются в массив, проверка работает корректно, но, если не указано name поле, то вернет сразу обе ошибки
// // как вернуть только 1 и нужно ли?
// const nameValidation = () => [
//     body('name').trim().not().isEmpty().withMessage('Name fields is required'),
//     body('name').trim().isLength({ min: 3, max: 10 }).withMessage('Name length should be from 3 to 10 characters')
// ]
// // export const getUsersRoutes = () => {

// export const linksRouter = express.Router();

// linksRouter.get('/',
//     async (req: RequestWithQuery<UsersGetQueryModel>, res: Response<UserResViewModel[]>) => {
//         // отсюда логику по работе с бд нужно вынести в отдельный слой - repositories
//         // const foundUsers = await usersRepository.findProducts(req.query.specialty)

//         let foundUsers = await usersRepository.findUsers(req.query.specialty)
//         //@ts-ignore
//         res.json(foundUsers)

//         //? in memory db
//         // let foundUsers = db.users;
//         // users?specialty=end; видимо, "end" будет query
//         // if (req.query.specialty) {
//         //     foundUsers = db.users.filter(user => user.specialty.indexOf(req.query.specialty) > -1) // стандартный поиск подстроки и возвращение объекта
//         // }
//         // res.json(foundUsers)
//     })

// // id URI не типизирую - всегда строка. Потом все-таки типизировал, чтобы унифицировать 
// linksRouter.post('/login',
//     nameValidation(), passwordValidation(), inputValidationMiddleware,
//     async (req: RequestWithBody<UserPostCreateBodyModel>, res: Response) => {
//         try {
//             const { username, password } = req.body;
//             const foundUser = await authRepository.findUserByUsername(username);
//             if (!foundUser.length) {
//                 return res.status(HTTP_Statuses.BAD_REQUEST_400).json(`Пользователь с именем ${username} не существует`)
//             }
//             // console.log(foundUser)
//             //спопоставление пароля - того, что отправлен, с тем, что хранится в бд. Правильно ли делать ее тут, а не при помощи бд?
//             const validPassword = bcrypt.compareSync(password, foundUser[0].password);
//             if (!validPassword) {
//                 return res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "Введен неправильный пароль" })
//             }
//             // const token = generateAccessToken(foundUser[0].id);
//             const tokens = tokenService.generateTokens({ id: foundUser[0].id, username: foundUser[0].username });
//             // сохранение рефреш токена в коллекции токенов
//             await tokenService.saveRefreshTokenInDB(foundUser[0].id, tokens.refreshToken)
//             // сохранение рефреш токена в куки на 30 дней - срок как у самого токена
//             res.cookie('refreshToken', tokens.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
//             res.json({ accessToken: tokens.accessToken, username: foundUser[0].username });
//         } catch (e) {
//             console.log(e)
//             res.status(HTTP_Statuses.BAD_REQUEST_400).json({ message: "login error" })
//         }
//     })

// linksRouter.post('/',
//     nameValidation(), inputValidationMiddleware,
//     async (req: RequestWithBody<UsersPostBodyModel>, res: Response<UserResViewModel>) => {

//         // валидация
//         // if (!req.body.name || !req.body.specialty) {
//         //     res.sendStatus(HTTP_Statuses.BAD_REQUEST_400)
//         //     return;
//         // }

//         //? in memory request
//         // const newUser: User = {
//         //     id: crypto.randomUUID(),
//         //     name: req.body.name,
//         //     specialty: req.body.specialty
//         // }
//         // db.users.push(newUser)

//         //? mongodb request
//         // const newUser = {
//         //     name: req.body.name,
//         //     specialty: 'not stated',
//         //     id: 'id from react'
//         // }
//         const newUser = await usersRepository.createUser(req.body.name);

//         res
//             .status(HTTP_Statuses.CREATED_201) // выдаю свой статус, не позволяя передавать его автоматически
//             .json(newUser);


//     })

// // id URI не типизирую - всегда строка
// linksRouter.delete('/:id', (req: RequestWithParams<UserUriIdString>, res: Response) => {

//     if (!db.users.find(user => user.id === req.params.id)) {
//         res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
//         return;
//     }

//     db.users = db.users.filter(user => user.id !== req.params.id)

//     res.sendStatus(HTTP_Statuses.NO_CONTENT_204) // no content
// })

// // хотя методы post и put требую одинаковые объекты, все равно разделю на сущности, потому что put может отличаться от post, например можно отправить
// // не весь объект, который изменился, чтобы я тут искал изменения, а лишь принимать изменившиеся поля, тогда формы объектов put и post
// // будут очевидно отличаться
// linksRouter.put('/:id', (req: RequestWithParamsAndBody<UserUriIdString, UsersPutBodyModel>, res: Response) => {
//     const foundUser = db.users.find(user => user.id === req.params.id)
//     if (!foundUser) {
//         res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
//         return;
//     }

//     if (req.body.name) foundUser.name = req.body.name;
//     if (req.body.specialty) foundUser.specialty = req.body.specialty;

//     res.sendStatus(HTTP_Statuses.NO_CONTENT_204)
// })

// // return usersRouter
// // }

