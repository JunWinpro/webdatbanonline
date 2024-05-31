import express from "express";
import authentication from "./routes/authentication.route.js";
import renewAccessToken from "./routes/renewAcessToken.route.js";
import userController from "../controllers/user.controller.js";
import userRoute from "./routes/user.route.js";

const rootRouter = express.Router();
rootRouter.use('/authentication', authentication);
rootRouter.use('/renew-access-token', renewAccessToken)
rootRouter.use('/users', userRoute);

export default rootRouter 