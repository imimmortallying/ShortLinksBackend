import { NextFunction, Request, Response } from "express";
import { TokensGenerator } from "../_refact/infra/tokens.generator/impl/tokens.generator";
import { RequestWithBody } from "../core/types/types";
import { StatusCodes } from "../_refact/presentation/api/api.consts";


interface SendLinkDto  {
    link: string,
    user: string,
    status: linkStatuses
}

enum linkStatuses {
    anon = 'anon',
    signedin = 'signedin'
}

export const authMiddleware = (req:RequestWithBody<SendLinkDto>, res: Response, next: NextFunction) => {
    try {
        // проверка анонимности или авторизованности. т.к. у анонима нет токенов

        // проверка соответствия поля статус нужным значениям
        if ( !(req.body.status in linkStatuses) ) {
            return res.status(StatusCodes.BAD_REQUEST).json({message:"Поле status не соответствует схеме"})
        }

        const authOrAnon = req.body.status;
        if (authOrAnon === 'anon') {
            next();
            return;
        }

        const tokenService = new TokensGenerator ();
        
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({message:"no access token - пользователь не авторизован"})
        }

        const decodedData = tokenService.validateAccessToken(accessToken);
        if (!decodedData){
            return res.status(StatusCodes.UNAUTHORIZED).json({message:"token decoding error - пользователь не авторизован"});
        }

        req.body.user = decodedData;
        return next();
    } catch (e) {
        console.log(e)
        return res.status(StatusCodes.BAD_REQUEST).json({message:"Неизвестная ошибка при авторизации"})
    }
}