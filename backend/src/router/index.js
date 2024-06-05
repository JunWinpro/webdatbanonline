import express from "express";
import renewAccessToken from "./routes/renewAcessToken.route.js";
import userRoute from "./routes/user.route.js";

const rootRouter = express.Router();
rootRouter.use('/renew-access-token', renewAccessToken)
rootRouter.use('/users', userRoute);

export default rootRouter 