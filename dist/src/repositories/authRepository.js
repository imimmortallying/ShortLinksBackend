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
exports.authRepository = void 0;
const db_1 = require("./db");
exports.authRepository = {
    // не забыл ли я тут await?
    checkIsUserRegistred(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersCollection.find({ username: username }).toArray();
        });
    },
    findUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersCollection.find({ username: username }).toArray();
        });
    },
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersCollection.find({ id: id }).toArray();
        });
    },
    createNewUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.usersCollection.insertOne(newUser);
            return newUser;
        });
    }
};
