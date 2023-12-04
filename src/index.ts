// const express = require('express');
import express, {Request, Response} from 'express';

const cors = require("cors"); // !middleware для избежания cors ошибки. С cors разобраться позже!

const app = express();
const port = 3000

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

// parsing middleware, применяется при получении каждого запроса:
const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware)
app.use(cors())

const db = {
  users: [
    { id: '1', name: 'alex', specialty: 'backend' },
    { id: '2', name: 'dima', specialty: 'frontend' },
    { id: '3', name: 'putin', specialty: 'czar' },
    { id: '4', name: 'baiden', specialty: 'president' },
  ]
}

app.get('/', (req:Request, res:Response) => {
  const a = 5;
  if (a > 6) {
    res.send({ message: `a > 6` })
  }
  else res.send({ message: "a > 6" })
  // else res.json({message: "a > 6"}) // лучше вернуть так, с явным приведением
  // else res.send(404) // число вернется статусом
  // else res.sendStatus(404) // лучше писать явный код
})

app.get('/users', (req:Request, res:Response) => {

  let foundUsers = db.users;

  // users?specialty=end; видимо, "end" будет query
  if (req.query.specialty) {
    foundUsers = db.users.filter(user => user.specialty.indexOf(req.query.specialty as string) > -1) // стандартный поиск подстроки и возвращение объекта
  }
  res.json(foundUsers)
})

app.get('/users/:id', (req:Request, res:Response) => { // работа с URI, теперь могу делать запрос на конкретный id 

  const foundUser = db.users.find(user => user.id === req.params.id)
  // в запросе я не вижу свойства params. Тогда, оно должно формироваться фреймворком исходя из эндпоинта?

  // согласно REST API, обрабатываем несуществующий эндпоинт - 404
  if (!foundUser) {
    res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
    return;
  }

  res.json(foundUser)
})

app.post('/users', (req:Request, res:Response) => {

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

app.delete('/users/:id', (req:Request, res:Response)=>{

  if (!db.users.find(user => user.id === req.params.id)) {
    res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
    return;
  } 

  db.users = db.users.filter(user => user.id !== req.params.id)

  res.sendStatus(HTTP_Statuses.NO_CONTENT_204) // no content
})

app.put('/users/:id', (req:Request, res:Response)=>{
  const foundUser = db.users.find(user => user.id === req.params.id)
  if (!foundUser){
    res.sendStatus(HTTP_Statuses.NOT_FOUND_404);
    return;
  }

  if (req.body.name) foundUser.name = req.body.name;
  if (req.body.specialty) foundUser.specialty = req.body.specialty;

  res.sendStatus(HTTP_Statuses.NO_CONTENT_204)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
