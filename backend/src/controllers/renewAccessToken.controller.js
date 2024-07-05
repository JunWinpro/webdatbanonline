import dataResponse from "../dataResponse/data.response.js"
import returnError from "../errors/error.js"
import jwtToken from "../utils/jwtToken.util.js"

const renewAccessTokenController = (req, res) => {
    try {
        const data = {
            userId: req.user.userId,
            email: req.user.email,
        }

        const accessToken = jwtToken.createToken(data, "AT")

        const message = "Renew access token success"
        dataResponse(res, 201, message, { accessToken })
    }
    catch (err) {
        console.log('authentication controller err: ', err)

        returnError(res, 403, err)
    }
}
export default renewAccessTokenController