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
exports.usersRepository = {
    findUsers(specialty) {
        return __awaiter(this, void 0, void 0, function* () {
            if (specialty) {
                console.log();
                return db_1.exmpUsersCollection.find({ specialty: { $regex: specialty } }).toArray();
            }
            else {
                return db_1.exmpUsersCollection.find({}).toArray();
            }
        });
    },
    // нужно ли что-то возвращать из бд? мб сделать запись, сразу же ее считать - удостовериться, что запись произошла и вернуть ее
    // или проще сделать запрос в бд и получить успех/неуспех. Как? Возвращает ли mongo автоматически ошибку
    createUser(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = {
                name: name,
                specialty: 'name created in react',
                id: 'created in react'
            };
            const result = yield db_1.exmpUsersCollection.insertOne(newUser);
            return newUser;
        });
    },
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            let foundUserById = yield db_1.exmpUsersCollection.findOne({ id: id });
            if (foundUserById) {
                return foundUserById;
            }
            else {
                return foundUserById;
            }
        });
    }
};
