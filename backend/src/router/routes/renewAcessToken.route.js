import express from "express"
import renewAccessTokenController from "../../controllers/renewAccessToken.controller.js"
import tokenMiddleware from "../../middlewares/token.middleware.js"

const renewAccessToken = express.Router()
renewAccessToken.post('/', tokenMiddleware.verifyRefreshToken, renewAccessTokenController)

export default renewAccessToken