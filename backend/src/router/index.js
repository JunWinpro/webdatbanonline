import express from "express";
import authentication from "./routes/authentication.route.js";
import renewAccessToken from "./routes/renewAcessToken.route.js";

const rootRouter = express.Router();
rootRouter.use('/authentication', authentication);
rootRouter.use('/renew-access-token', renewAccessToken)


export default rootRouter