import ModelDb from "../models/model.js";
import bcryptPassword from "../utils/bcrypt.util.js";
import jwtToken from "../utils/jwtToken.util.js"
const userController = {
    register: {
        user: async (req, res) => {
            try {
                const { email, phone, password, firstName, lastName, gender } = req.body;

                const userExist = await ModelDb.UserModel.findOne({
                    $or: [
                        { email },
                        { phone },
                    ]
                })

                if (userExist?.email === email) throw new Error("Email already exists")
                if (userExist?.phone === phone) throw new Error("Phone already exists")

                const employeeExist = await ModelDb.EmployeeModel.findOne({
                    phone
                })
                if (employeeExist) throw new Error("Phone already exists")

                const hashPassword = bcryptPassword.hashPassword(password)

                const newUser = await ModelDb.UserModel.create({
                    email,
                    phone,
                    password: hashPassword,
                    firstName,
                    lastName,
                    gender,
                })

                delete newUser.role
                delete newUser.password

                res.status(201).json({
                    message: "User created successfully",
                    data: newUser,
                    success: true
                })
            }
            catch (err) {
                console.log("user register err: ", err)
                res.status(403).json({
                    message: err.message,
                    success: false,
                    data: null
                })
            }
        },
        employee: async (req, res) => {
            try {
                const { username, phone, password, firstName, lastName, gender, employeeId } = req.body;

                const employeeExist = await ModelDb.EmployeeModel.findOne({
                    $or: [
                        { username },
                        { phone }
                    ]
                })

                if (employeeExist?.username === username) throw new Error("Username already exists")
                if (employeeExist?.phone === phone) throw new Error("Phone already exists")

                const userExist = await ModelDb.UserModel.findOne({
                    phone
                })
                if (userExist) throw new Error("Phone already exists")

                const hashPassword = bcryptPassword.hashPassword(password)

                const newUser = await ModelDb.EmployeeModel.create({
                    username,
                    phone,
                    password: hashPassword,
                    employeeId,
                    firstName,
                    lastName,
                    gender,
                })

                delete newUser.role
                delete newUser.password

                res.status(201).json({
                    message: "User created successfully",
                    data: newUser,
                    success: true
                })
            }
            catch (err) {
                console.log("user register err: ", err)
                res.status(403).json({
                    message: err.message,
                    success: false,
                    data: null

                })
            }
        }
    },
    login: async (req, res) => {
        try {
            const { email, phone, username, password } = req.body

            let user;
            if (username || phone) {
                user = await ModelDb.EmployeeModel.findOne({
                    $or: [
                        { phone },
                        { username }
                    ]
                })
                if (!user) throw new Error("Username/Phone or password is wrong")
            }
            else if (email) {
                user = await ModelDb.UserModel.findOne({ email })
                if (!user) throw new Error("Email or password is wrong")
            }

            const checkPassword = bcryptPassword.comparePassword(password, user.password)
            if (!checkPassword) throw new Error("Password is wrong")

            const userInfo = { ...user.toObject() }

            const accessToken = jwtToken.createToken({
                userId: userInfo._id,
                phone: userInfo.phone
            }, "AT")
            const refreshToken = jwtToken.createToken({
                userId: userInfo._id,
                phone: userInfo.phone
            }, "RT")

            delete userInfo.password

            res.status(201).json({
                message: "Login success",
                data: {
                    userInfo,
                    accessToken,
                    refreshToken
                },
                success: true
            })
        }
        catch (err) {
            console.log("user login err: ", err)

            res.status(403).json({
                message: err.message,
                success: false,
                data: null

            })
        }
    },
    getAllUsers: async (_, res) => {
        try {
            const allUsers = await ModelDb.UserModel.find({
                isDeleted: false
            })
            if (!allUsers) throw new Error("User not found")

            const usersWithoutPassword = allUsers.map(user => {
                const { password, ...userWithoutPassword } = user.toObject();
                return userWithoutPassword;
            });

            res.status(200).json({
                message: "Get all users success",
                data: usersWithoutPassword,
                success: true
            })
        }

        catch (err) {
            console.log("get all users err: ", err)

            res.status(403).json({
                message: err.message,
                success: false,
                data: null
            })
        }
    },
    getUserById: async (req, res) => {
        try {
            const id = req.params
            const user = await ModelDb.UserModel.findById(id)
            if (!user) throw new Error("User not found")
            delete user.password
            delete user.role
            res.status(200).json({
                message: "Get user success",
                data: user,
                success: true
            })
        }
        catch (err) {
            console.log("get user by id err")
            res.status(403).json({
                message: err.message,
                success: false,
                data: null
            })
        }
    }

}

export default userController