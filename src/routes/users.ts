import express, { Request, Response } from 'express';
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../../types/types';
import { UsersGetQueryModel } from '../model/UsersGetQueryModel';
import { UsersPostBodyModel } from '../model/UsersPostBodyModel';
import { UsersPutBodyModel } from '../model/UsersPutBodyModel';
import { UserResViewModel } from '../model/UserResViewModel';
import { UserUriIdString } from '../model/UserUriIdString';



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
    ]
}


export const getUsersRoutes = () => {

    const usersRouter = express.Router();

    // usersRouter.get('/', (req: Request, res: Response) => {
    //     const a = 5;
    //     if (a > 6) {
    //         res.send({ message: `a > 6` })
    //     }
    //     else res.send({ message: "a > 6" })
    //     // else res.json({message: "a > 6"}) // лучше вернуть так, с явным приведением
    //     // else res.send(404) // число вернется статусом
    //     // else res.sendStatus(404) // лучше писать явный код
    // })

    usersRouter.get('/', (req: RequestWithQuery<UsersGetQueryModel>, res: Response<UserResViewModel[]>) => {

        let foundUsers = db.users;

        // users?specialty=end; видимо, "end" будет query
        if (req.query.specialty) {
            foundUsers = db.users.filter(user => user.specialty.indexOf(req.query.specialty) > -1) // стандартный поиск подстроки и возвращение объекта
        }
        res.json(foundUsers)
    })

    // id URI не типизирую - всегда строка. Потом все-таки типизировал, чтобы унифицировать 
    usersRouter.get('/:id', (req: RequestWithParams<UserUriIdString>, res: Response<UserResViewModel>) => { // работа с URI, теперь могу делать запрос на конкретный id 

        const foundUser = db.users.find(user => user.id === req.params.id)
        // в запросе я не вижу свойства params. Тогда, оно должно формироваться фреймворком исходя из эндпоинта?

        // согласно REST API, обрабатываем несуществующий эндпоинт - 404
        if (!foundUser) {
            res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
            return;
        }

        res.json(foundUser)
    })

    usersRouter.post('/', (req: RequestWithBody<UsersPostBodyModel>, res: Response<UserResViewModel>) => {

        // валидация
        if (!req.body.name || !req.body.specialty) {
            res.sendStatus(HTTP_Statuses.BAD_REQUEST_400);
            return;
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            name: req.body.name,
            specialty: req.body.specialty
        }

        db.users.push(newUser)

        res
            .status(HTTP_Statuses.CREATED_201) // выдаю свой статус, не позволяя передавать его автоматически
            .json(newUser);
    })

    // id URI не типизирую - всегда строка
    usersRouter.delete('/:id', (req: RequestWithParams<UserUriIdString>, res: Response) => {

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
    usersRouter.put('/:id', (req: RequestWithParamsAndBody<UserUriIdString, UsersPutBodyModel>, res: Response) => {
        const foundUser = db.users.find(user => user.id === req.params.id)
        if (!foundUser) {
            res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
            return;
        }

        if (req.body.name) foundUser.name = req.body.name;
        if (req.body.specialty) foundUser.specialty = req.body.specialty;

        res.sendStatus(HTTP_Statuses.NO_CONTENT_204)
    })

    return usersRouter
}

