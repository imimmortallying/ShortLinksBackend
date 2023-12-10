"use strict";
// import { client } from "./db"
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
exports.usersRepository = void 0;
const db_1 = require("./db");
// const usersCollection = client.db("testDB").collection("users")
exports.usersRepository = {
    findUsers(specialty) {
        return __awaiter(this, void 0, void 0, function* () {
            if (specialty) {
                return db_1.usersCollection.find({ specialty: { $regex: specialty } }).toArray();
            }
            else {
                return db_1.usersCollection.find({}).toArray();
            }
        });
    }
};
