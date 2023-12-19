import { NextFunction, Request, Response } from "express";
const jwt = require('jsonwebtoken');
const {secret} = require('../config');
const tokenService = require('../services/tokenService')

export const authMiddleware = (req:Request, res: Response, next: NextFunction) => {
    try {
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
        next();
    } catch (e) {
        console.log(e)
        return res.status(403).json({message:"Пользователь не авторизован"})
    }
}