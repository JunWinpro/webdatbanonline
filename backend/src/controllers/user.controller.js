import ModelDb from "../models/model.js"
import bcryptPassword from "../utils/bcrypt.util.js"
import jwtToken from "../utils/jwtToken.util.js"
import { v2 as cloudinary } from "cloudinary"
const userController = {
    register: async (req, res) => {
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

            const returnUser = { ...newUser.toObject() }

            delete returnUser.role
            delete returnUser.password

            res.status(201).json({
                message: "User created successfully",
                data: returnUser,
                success: true
            })
        }
        catch (err) {
            console.log("user register err: ", err)
            res.status(403).json({
                message: err.message,
                success: false,
                data: null,
                err
            })
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await ModelDb.UserModel.findOne({
                email,
                isDeleted: false,
            })
            if (!user) throw new Error("Email or password is wrong")

            const checkPassword = bcryptPassword.comparePassword(password, user.password)
            if (!checkPassword) throw new Error("Password is wrong")

            const returnUser = { ...user.toObject() }

            const accessToken = jwtToken.createToken({
                userId: returnUser._id,
                email: returnUser.email,
                role: returnUser.role,
                isDeleted: returnUser.isDeleted,
            }, "AT")
            const refreshToken = jwtToken.createToken({
                userId: returnUser._id,
                email: returnUser.email,
                role: returnUser.role,
                isDeleted: returnUser.isDeleted,
            }, "RT")

            delete returnUser.password
            delete returnUser.createdAt
            delete returnUser.updatedAt
            delete returnUser.isDeleted
            delete returnUser.isVerified

            res.status(201).json({
                message: "Login success",
                data: {
                    userInfo: returnUser,
                    accessToken,
                    refreshToken
                },
                success: true
            })
        }
        catch (err) {
            console.log("user login err: ", err)

            res.status(400).json({
                message: err.message,
                success: false,
                data: null,
                err
            })
        }
    },

    getAllUsers: async (_, res) => {
        try {
            const allUsers = await ModelDb.UserModel.find({
                isDeleted: false
            })
            if (!allUsers) throw new Error("User not found")

            const returnUser = allUsers.map(user => {
                const { password, role, createdAt, updatedAt, isDeleted, isVerified, ...returnUser } = user.toObject();
                return returnUser;
            });

            res.status(200).json({
                message: "Get all users success",
                data: returnUser,
                success: true
            })
        }

        catch (err) {
            console.log("get all users err: ", err)

            res.status(403).json({
                message: err.message,
                success: false,
                data: null,
                err
            })
        }
    },

    getUserById: async (req, res) => {
        try {
            const { id } = req.params
            const user = await ModelDb.UserModel.findOne({
                _id: id,
                isDeleted: false
            })
            if (!user) throw new Error("User not found")

            const returnUser = { ...user.toObject() }

            delete returnUser.password
            delete returnUser.role
            delete returnUser.createdAt
            delete returnUser.updatedAt
            delete returnUser.isDeleted
            delete returnUser.isVerified

            res.status(200).json({
                message: "Get user success",
                data: returnUser,
                success: true
            })
        }
        catch (err) {
            console.log("get user by id err")
            res.status(403).json({
                message: err.message,
                success: false,
                data: null,
                err
            })
        }
    },

    updateUserById: async (req, res) => {
        try {
            const { id } = req.params
            const { password, newPassword } = req.body

            const user = req.user
            if (user.userId !== id) throw new Error("You don't have permission for this user")

            let currentUser = await ModelDb.UserModel.findById(user.userId)
            if (!currentUser) throw new Error("User not found")

            let hashPassword;
            if (password && newPassword) {
                if (bcryptPassword.comparePassword(password, currentUser.password)) throw new Error("Password is incorrect")
                if (bcryptPassword.comparePassword(newPassword, currentUser.password)) throw new Error("Password is the same as current please change different password")
                hashPassword = bcryptPassword.hashPassword(newPassword)
            }

            const file = req.file
            let avatar;
            if (file) {
                const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
                const fileName = `${currentUser._id.toString()}-${new Date().getTime()}`
                const result = await cloudinary.uploader.upload(dataUrl, {
                    folder: `Avatar/${currentUser._id.toString()}`,
                    public_id: fileName,
                    resource_type: "auto"
                })
                if (!result) throw new Error("Upload failed")
                avatar = result.secure_url
            }

            currentUser = {
                ...currentUser.toObject(),
                ...req.body,
                password: hashPassword ? hashPassword : currentUser.password,
                avatar: avatar ? avatar : currentUser.avatar
            }
            const updatedUser = await ModelDb.UserModel.findByIdAndUpdate(id, currentUser, { new: true })

            delete updatedUser.password
            delete updatedUser.role

            res.status(201).json({
                message: "Update user success",
                data: updatedUser,
                success: true
            })
        }
        catch (err) {
            console.log("update user by id err: ", err)
            res.status(403).json({
                message: err.message,
                success: false,
                data: null,
                err
            })
        }
    },

    changeRole: async (req, res) => {
        try {
            const { id } = req.params
            const { role } = req.body

            const currentUser = await ModelDb.UserModel.findById(id)
            if (!currentUser) throw new Error("User not found")

            currentUser.role = role
            currentUser.save()

            res.status(201).json({
                message: "Update user success",
                data: {
                    role: currentUser.role
                },
                success: true
            })
        }
        catch (err) {
            console.log("update user by id err: ", err)
            res.status(403).json({
                message: err.message,
                success: false,
                data: null,
                err
            })
        }
    },

    deleteUserById: async (_, res) => {
        try {
            const { id } = req.params

            const user = req.user
            if (user.userId !== id) throw new Error("You don't have permission for this user")

            const currentUser = await ModelDb.UserModel.findById(id)
            if (!currentUser) throw new Error("User not found")

            currentUser.isDeleted = true

            currentUser.save()
            res.status(201).json({
                success: true,
                data: {},
                message: "Delete user success"
            })
        }
        catch (err) {
            console.log("update user by id err: ", err)
            res.status(403).json({
                message: err.message,
                success: false,
                data: null
            })
        }
    }
}

export default userController