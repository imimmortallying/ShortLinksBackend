import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const tokenService = require('../services/tokenService')

export const authMiddleware = (req:Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(403).json({message:"Пользователь не авторизован"})
        }
        // const decodedData = jwt.verify(token, secret);
        const decodedData = tokenService.validateAccessToken(accessToken);
        if (!decodedData){
            return res.status(403).json({message:"Пользователь не авторизован"});
        }
        //добавляю новое поле в req
        //@ts-ignore
        req.user = decodedData;
        next();
    } catch (e) {
        console.log(e)
        return res.status(403).json({message:"Пользователь не авторизован"})
    }
}