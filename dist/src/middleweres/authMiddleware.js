"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const tokenService = require('../services/tokenService');
const authMiddleware = (req, res, next) => {
    var _a;
    try {
        const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({ message: "no access token - пользователь не авторизован" });
        }
        // const decodedData = jwt.verify(token, secret);
        const decodedData = tokenService.validateAccessToken(accessToken);
        if (!decodedData) {
            return res.status(401).json({ message: "token decoding error - пользователь не авторизован" });
        }
        //добавляю новое поле в req.body
        req.body.user = decodedData;
        next();
    }
    catch (e) {
        console.log(e);
        return res.status(403).json({ message: "Пользователь не авторизован" });
    }
};
exports.authMiddleware = authMiddleware;
