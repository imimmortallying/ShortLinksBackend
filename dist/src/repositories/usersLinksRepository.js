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
exports.usersLinksRepository = void 0;
const db_1 = require("./db");
exports.usersLinksRepository = {
    pushLink(owner, link) {
        return __awaiter(this, void 0, void 0, function* () {
            // owner - либо ID залогиненого пользователя, либо finger анонимного
            // переделать структуру запроса, но не удаляй.
            // Потому что похожый запрос будет при добавлении ip источника перехода в массиве, внутри объекта ссылки
            return yield db_1.usersLinksCollection.insertOne({
                "owner": owner,
                "original": link,
                "alias": "short",
                "count": 0
            });
        });
    },
    findOriginalLink(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundOriginalLink = yield db_1.usersLinksCollection.findOne({ alias: alias });
            return foundOriginalLink === null || foundOriginalLink === void 0 ? void 0 : foundOriginalLink.original;
        });
    },
    hasLinkAlready(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasLink = yield db_1.usersLinksCollection.findOne({ original: link });
            return hasLink ? true : false;
        });
    },
    hasAliasAlready(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            const hasAlias = yield db_1.usersLinksCollection.findOne({ original: alias });
            return hasAlias ? true : false;
        });
    },
};
