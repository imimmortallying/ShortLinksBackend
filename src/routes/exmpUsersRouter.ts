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

const db: { users: User[] } = {
    users: [
        { id: '1', name: 'alex', specialty: 'backend' },
        { id: '2', name: 'dima', specialty: 'frontend' },
        { id: '3', name: 'putin', specialty: 'czar' },
        { id: '4', name: 'baiden', specialty: 'president' },
        { id: '5', name: 'zelensky', specialty: 'clown' },
    ]
}

//! ошибки добавляются в массив, проверка работает корректно, но, если не указано name поле, то вернет сразу обе ошибки
// как вернуть только 1 и нужно ли?
const nameValidation = () => [
    body('name').trim().not().isEmpty().withMessage('Name fields is required'),
    body('name').trim().isLength({ min: 3, max: 10 }).withMessage('Name length should be from 3 to 10 characters')
]
// export const getUsersRoutes = () => {

export const exmpUsersRouter = express.Router();

exmpUsersRouter.get('/',
    async (req: RequestWithQuery<UsersGetQueryModel>, res: Response<UserResViewModel[]>) => {
        // отсюда логику по работе с бд нужно вынести в отдельный слой - repositories
        // const foundUsers = await usersRepository.findProducts(req.query.specialty)

        let foundUsers = await usersRepository.findUsers(req.query.specialty)
        //@ts-ignore
        res.json(foundUsers)

        //? in memory db
        // let foundUsers = db.users;
        // users?specialty=end; видимо, "end" будет query
        // if (req.query.specialty) {
        //     foundUsers = db.users.filter(user => user.specialty.indexOf(req.query.specialty) > -1) // стандартный поиск подстроки и возвращение объекта
        // }
        // res.json(foundUsers)
    })

// id URI не типизирую - всегда строка. Потом все-таки типизировал, чтобы унифицировать 
exmpUsersRouter.get('/:id', 
    async (req: RequestWithParams<UserUriIdString>, res: Response<UserResViewModel>) => { // работа с URI, теперь могу делать запрос на конкретный id 

    const foundUser = await usersRepository.findUserById(req.params.id)


    //? in memory db
    // const foundUser = db.users.find(user => user.id === req.params.id)
    // в запросе я не вижу свойства params. Тогда, оно должно формироваться фреймворком исходя из эндпоинта?

    // согласно REST API, обрабатываем несуществующий эндпоинт - 404
    // if (!foundUser) {
    //     res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
    //     return;
    // }
        //@ts-ignore
    res.json(foundUser)
})

exmpUsersRouter.post('/',
    nameValidation(), inputValidationMiddleware,
    async (req: RequestWithBody<UsersPostBodyModel>, res: Response<UserResViewModel>) => {

        // валидация
        // if (!req.body.name || !req.body.specialty) {
        //     res.sendStatus(HTTP_Statuses.BAD_REQUEST_400)
        //     return;
        // }

        //? in memory request
        // const newUser: User = {
        //     id: crypto.randomUUID(),
        //     name: req.body.name,
        //     specialty: req.body.specialty
        // }
        // db.users.push(newUser)

        //? mongodb request
        // const newUser = {
        //     name: req.body.name,
        //     specialty: 'not stated',
        //     id: 'id from react'
        // }
        const newUser = await usersRepository.createUser(req.body.name);

        res
            .status(HTTP_Statuses.CREATED_201) // выдаю свой статус, не позволяя передавать его автоматически
            .json(newUser);

        
    })

// id URI не типизирую - всегда строка
exmpUsersRouter.delete('/:id', (req: RequestWithParams<UserUriIdString>, res: Response) => {

    if (!db.users.find(user => user.id === req.params.id)) {
        res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
        return;
    }

    db.users = db.users.filter(user => user.id !== req.params.id)

    res.sendStatus(HTTP_Statuses.NO_CONTENT_204) // no content
})

// хотя методы post и put требую одинаковые объекты, все равно разделю на сущности, потому что put может отличаться от post, например можно отправить
// не весь объект, который изменился, чтобы я тут искал изменения, а лишь принимать изменившиеся поля, тогда формы объектов put и post
// будут очевидно отличаться
exmpUsersRouter.put('/:id', (req: RequestWithParamsAndBody<UserUriIdString, UsersPutBodyModel>, res: Response) => {
    const foundUser = db.users.find(user => user.id === req.params.id)
    if (!foundUser) {
        res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
        return;
    }

    if (req.body.name) foundUser.name = req.body.name;
    if (req.body.specialty) foundUser.specialty = req.body.specialty;

    res.sendStatus(HTTP_Statuses.NO_CONTENT_204)
})

// return usersRouter
// }

