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
exports.usersTokenRepository = void 0;
const db_1 = require("./db");
exports.usersTokenRepository = {
    findTokenByUserid(userid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersTokenCollection.findOne({ id: userid });
        });
    },
    findTokenByItself(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.usersTokenCollection.findOne({ refreshToken: refreshToken });
        });
    },
    createUsersToken(newUsersToken) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.usersTokenCollection.insertOne(newUsersToken);
            return newUsersToken;
        });
    },
    refreshUsersToken(newUsersToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersTokenCollection.updateOne({ id: newUsersToken.id }, { $set: { refreshToken: newUsersToken.refreshToken } });
            return result.matchedCount === 1;
        });
    },
    // ulbi удаляет запись через поиск токена. Почему не поиск по ид юзера? есть ли разница. Удалю через id для унификации //! не смогу
    // в cookie будет храниться решреф токен сам по себе, поэтому и удаляю через поиск по нему?
    removeUsersToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.usersTokenCollection.deleteOne({ refreshToken: refreshToken });
            return result.deletedCount === 1;
        });
    }
};
