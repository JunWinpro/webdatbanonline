import jwtToken from "../utils/jwtToken.util.js"

const tokenMiddleware = {
    verifyAccessToken: (req, res, next) => {
        try {
            const authToken = req.headers['authorization']

            if (!authToken) throw new Error("Invalid token")

            const accessToken = authToken.split(" ")[1]

            const data = jwtToken.verifyToken(accessToken, "AT")

            req.user = data

            next()
        }
        catch (err) {

            console.log("verify access token err: ", err)

            let type = '';
            let getMessage = '';

            switch (err.message) {
                case 'invalid signature':
                    getMessage = 'Invalid token';
                    type = 'INVALID_TOKEN';
                    break;
                case 'jwt expired':
                    getMessage = 'Token expired';
                    type = 'EXP_TOKEN';
                    break;
                default:
                    getMessage = 'Unauthenticated';
                    type = 'UNAUTH';
                    break;
            }

            res.status(401).json({
                data: null,
                err,
                message: getMessage,
                type,
                success: false,
            });

        }
    },

    verifyRefreshToken: (req, res, next) => {
        try {
            const authToken = req.headers['authorization']

            if (!authToken) throw new Error("Invalid token")

            const refreshToken = authToken.split(" ")[1]

            const data = jwtToken.verifyToken(refreshToken, "RT")

            req.user = data

            next()
        }
        catch (err) {
            console.log("verify refresh token err: ", err)

            let type = '';
            let getMessage = '';

            switch (err.message) {
                case 'invalid signature':
                    getMessage = 'Invalid token';
                    type = 'INVALID_TOKEN';
                    break;
                case 'jwt expired':
                    getMessage = 'Token expired';
                    type = 'EXP_TOKEN';
                    break;
                default:
                    getMessage = 'Unauthenticated';
                    type = 'UNAUTH';
                    break;
            }

            res.status(401).json({
                data: null,
                err,
                message: getMessage,
                type,
                success: false,
            });

        }
    },
}

export default tokenMiddleware