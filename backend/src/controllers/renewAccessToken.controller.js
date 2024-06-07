import jwtToken from "../utils/jwtToken.util.js"

const renewAccessTokenController = (req, res) => {
    try {
        const data = {
            userId: req.user.userId,
            email: req.user.email,
        }

        const createdAccessToken = jwtToken.createToken(data, "AT")

        res.status(201).json({
            data: {
                accessToken: createdAccessToken
            },
            success: true,
            message: "Renew access token success"
        })
    }
    catch (err) {
        console.log('authentication controller err: ', err)

        res.status(403).json({
            message: err.message,
            data: null,
            success: false,
            err
        })
    }
}
export default renewAccessTokenController