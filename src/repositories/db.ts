import { MongoClient } from "mongodb";

const mongoUri = process.env.mongoUri = "mongodb://0.0.0.0:27017";
const client = new MongoClient(mongoUri);
const db = client.db('testDB');
export const usersCollection = db.collection('users')

export async function runDb() {
    try {

        //itk
        await client.connect();
        await client.db("testDB").command({ping:1})
        console.log('Connected to mongo server')

        // mongo
    //   const database = client.db('sample_mflix');
    //   const movies = database.collection('movies');
    //   // Query for a movie that has the title 'Back to the Future'
    //   const query = { title: 'Back to the Future' };
    //   const movie = await movies.findOne(query);
    //   console.log(movie);
    } catch {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }