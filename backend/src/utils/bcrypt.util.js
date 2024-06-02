import bcrypt from "bcrypt"
const bcryptPassword = {
    hashPassword: (password) => {
        const saltRounds = 7
        const salt = bcrypt.genSaltSync(saltRounds)
        const hashPassword = bcrypt.hashSync(password, salt)
        return hashPassword
    },
    comparePassword: (password, hashPassword) => {
        const checkPassword = bcrypt.compareSync(password, hashPassword)
        return checkPassword
    }
}

export default bcryptPassword