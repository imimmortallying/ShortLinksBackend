"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.usersCollection = void 0;
const mongodb_1 = require("mongodb");
const mongoUri = process.env.mongoUri = "mongodb://0.0.0.0:27017";
const client = new mongodb_1.MongoClient(mongoUri);
const db = client.db('testDB');
exports.usersCollection = db.collection('users');
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //itk
            yield client.connect();
            yield client.db("testDB").command({ ping: 1 });
            console.log('Connected to mongo server');
            // mongo
            //   const database = client.db('sample_mflix');
            //   const movies = database.collection('movies');
            //   // Query for a movie that has the title 'Back to the Future'
            //   const query = { title: 'Back to the Future' };
            //   const movie = await movies.findOne(query);
            //   console.log(movie);
        }
        catch (_a) {
            // Ensures that the client will close when you finish/error
            yield client.close();
        }
    });
}
exports.runDb = runDb;
