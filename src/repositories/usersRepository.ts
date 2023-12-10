// import { client } from "./db"

import { usersCollection } from "./db";

// const usersCollection = client.db("testDB").collection("users")

export const usersRepository = {
    
    async findUsers(specialty?:string) {
        if (specialty){
            return usersCollection.find({specialty: { $regex: specialty }}).toArray();
        } else {
            return usersCollection.find({}).toArray();
        }
    }

}