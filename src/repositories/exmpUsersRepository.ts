// import { client } from "./db"

import { exmpUsersCollection } from "./db";

// const usersCollection = client.db("testDB").collection("users")

interface User {
    id: string, // как правильно описать?
    name: string,
    specialty: string,
}

export const usersRepository = {
    
    async findUsers(specialty?:string) {
        if (specialty){
            console.log()
            return exmpUsersCollection.find({specialty: { $regex: specialty }}).toArray();
        } else {
            return exmpUsersCollection.find({}).toArray();
        }
    },

    // нужно ли что-то возвращать из бд? мб сделать запись, сразу же ее считать - удостовериться, что запись произошла и вернуть ее
    // или проще сделать запрос в бд и получить успех/неуспех. Как? Возвращает ли mongo автоматически ошибку
    async createUser(name:string) {

        const newUser = {
            name:name,
            specialty: 'name created in react',
            id: 'created in react'
        }
        const result = await exmpUsersCollection.insertOne(newUser)
        return newUser 
    },

    async findUserById(id:string) {
        //@ts-ignore
        let foundUserById = await exmpUsersCollection.findOne({id:id})
        if (foundUserById) {
            return foundUserById
        } else {
            return foundUserById
        }
    }

}