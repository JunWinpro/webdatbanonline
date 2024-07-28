import dataResponse from "../dataResponse/data.response.js"
import returnError from "../errors/error.js"
import jwtToken from "../utils/jwtToken.util.js"
import ModelDb from "../models/model.js"
import userResponse from "../dataResponse/user.js"
const renewAccessTokenController = async (req, res) => {
    try {
        const data = {
            userId: req.user.userId,
            email: req.user.email,
            role: req.user.role,
        }

        const accessToken = jwtToken.createToken(data, "AT")
        const userInfo = await ModelDb.UserModel.findById(data.userId)
        const message = "Renew access token success"
        dataResponse(res, 201, message, {
            accessToken,
            ...userResponse(userInfo)
        })
    }
    catch (err) {
        returnError(res, 403, err)
    }
}
export default renewAccessTokenController