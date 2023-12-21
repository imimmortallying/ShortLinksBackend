import { MongoClient, MongoNetworkError } from "mongodb";

const SERVICE_MONGO_URL_DEFAULT = "mongodb://0.0.0.0:27017";

const serviceMongoUrl = process.env.SL_SERVICE__MONGO_URL || SERVICE_MONGO_URL_DEFAULT;

const client = new MongoClient(serviceMongoUrl);

const testDB = client.db('testDB');
export const exmpUsersCollection = testDB.collection('users')

// users DB
const usersDB = client.db('users');
export const usersCollection = usersDB.collection('usersCollection');
export const usersTokenCollection = usersDB.collection('usersTokenCollection');
export const usersLinksCollection = usersDB.collection('usersLinksCollection');

export async function runDb() {
  try {
    console.log('Establishing connection to mongo server')

    //itk
    await client.connect();
    await client.db("testDB").command({ ping: 1 })
    await usersDB.command({ ping: 1 })

    console.log('Connected to mongo server')
  } catch (error) {
    if (error instanceof MongoNetworkError) {
      console.log('Could not establish connection to mongo server');
    }

    throw error;
  }
}