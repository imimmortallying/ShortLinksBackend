import { Router } from 'express'
import authRouter from './auth/auth.router';
import linkRouter from './links/link.router';

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/link", linkRouter);

export default v1Router;