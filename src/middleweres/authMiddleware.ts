import { NextFunction, Request, Response } from "express";
import { TokensGenerator } from "../_refact/infra/tokens.generator/impl/tokens.generator";
import { RequestWithBody } from "../core/types/types";


interface SendLinkDto  {
    link: string,
    user: string,
    status: "anon" | 'signedin'
}

export const authMiddleware = (req:RequestWithBody<SendLinkDto>, res: Response, next: NextFunction) => {
    try {
        // проверка анонимности или авторизованности. т.к. у анонима нет токенов
        const authOrAnon = req.body.status;
        if (authOrAnon === 'anon') {
            next();
            return;
        }

        const tokenService = new TokensGenerator ();
        
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).json({message:"no access token - пользователь не авторизован"})
        }

        const decodedData = tokenService.validateAccessToken(accessToken);
        if (!decodedData){
            return res.status(401).json({message:"token decoding error - пользователь не авторизован"});
        }

        req.body.user = decodedData;
        return next();
    } catch (e) {
        console.log(e)
        return res.status(403).json({message:"Пользователь не авторизован"})
    }
}