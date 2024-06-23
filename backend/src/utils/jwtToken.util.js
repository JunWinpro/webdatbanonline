import jwt from 'jsonwebtoken'
const jwtToken = {
    createToken: (document, type) => {
        const secretKey = type === "AT" ? process.env.AT_SECRET_KEY : process.env.RT_SECRET_KEY
        const expireTime = type === "AT" ? process.env.AT_EXPIRES_IN : process.env.RT_EXPIRES_IN
        const token = jwt.sign(document, secretKey,
            {
                expiresIn: expireTime
            }
        )
        return token
    },
    verifyToken: (document, type) => {
        const secretKey = type === "AT" ? process.env.AT_SECRET_KEY : process.env.RT_SECRET_KEY
        const decoded = jwt.verify(document, secretKey)
        return decoded
    }
}
export default jwtToken