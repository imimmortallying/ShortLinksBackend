import { MongoClient } from "mongodb";

const mongoUri = process.env.mongoUri = "mongodb://0.0.0.0:27017";
const client = new MongoClient(mongoUri);
const testDB = client.db('testDB');
export const exmpUsersCollection = testDB.collection('users')

// users DB
const usersDB = client.db('users');
export const usersCollection = usersDB.collection('usersCollection');
export const usersTokenCollection = usersDB.collection('usersTokenCollection');
export const usersLinksCollection = usersDB.collection('usersLinksCollection');

export async function runDb() {
    try {

        //itk
        await client.connect();
        await client.db("testDB").command({ping:1})
        await usersDB.command({ping:1})
        console.log('Connected to mongo server')

    } catch {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }