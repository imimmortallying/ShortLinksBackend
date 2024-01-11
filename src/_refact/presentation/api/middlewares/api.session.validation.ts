import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const tokenService = require('../services/tokenService')

export const sessionValidation = (req:Request, res: Response, next: NextFunction) => {
    try {
        // проверка анонимности или авторизованности. т.к. у анонима нет токенов
        const {authOrAnon } = req.body;
        if (authOrAnon === 'anon') {
            next();
            return;
        }

        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({message:"no access token - пользователь не авторизован"})
        }
        // const decodedData = jwt.verify(token, secret);
        const decodedData = tokenService.validateAccessToken(accessToken);
        if (!decodedData){
            return res.status(401).json({message:"token decoding error - пользователь не авторизован"});
        }
        //добавляю новое поле в req.body
        req.body.user = decodedData;
        return next();
    } catch (e) {
        console.log(e)
        return res.status(403).json({message:"Пользователь не авторизован"})
    }
}