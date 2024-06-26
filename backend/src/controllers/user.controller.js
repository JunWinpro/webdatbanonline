import ModelDb from "../models/model.js"
import bcryptPassword from "../utils/bcrypt.util.js"
import jwtToken from "../utils/jwtToken.util.js"
import { v2 as cloudinary } from "cloudinary"
import pageSplit from "../utils/pageSplit.util.js"
import sendEmail from "../utils/sendEmail.js"
import lowerCaseString from "../utils/lowerCaseString.js"
import trimString from "../utils/trimString.js"
import returnError from "../errors/error.js"
import userDTO from "../dto/user.dto.js"
import dataResponse from "../dto/data.js"
const userController = {
    register: async (req, res) => {
        try {
            const { email, phone, password } = req.body;

            const userExist = await ModelDb.UserModel.findOne({
                $or: [
                    { email },
                    { phone },
                ]
            })

            if (userExist?.email === email) throw new Error("Email already used")
            if (userExist?.phone === phone) throw new Error("Phone already used")

            const employeeExist = await ModelDb.EmployeeModel.findOne({
                phone
            })
            if (employeeExist) throw new Error("Phone already used")

            const hashPassword = bcryptPassword.hashPassword(password)

            const veryficationToken = crypto.randomUUID()

            const newUser = await ModelDb.UserModel.create({
                ...req.body,
                password: hashPassword,
                veryficationToken
            })
            const info = {
                path: 'verify-user',
                subject: 'Verify account',
                action: 'verify your account'
            }
            await sendEmail(email, veryficationToken, info)

            const message = "Please check your email for verify account"
            dataResponse(res, 201, message, userDTO(newUser))
        }
        catch (err) {
            console.log("user register err: ", err.message)
            returnError(res, 403, err)
        }
    },
    verifyUser: async (req, res) => {
        try {
            const { token } = req.params
            const user = await ModelDb.UserModel.findOne({
                veryficationToken: token
            })
            if (!user) throw new Error("Token is invalid")

            user.isVerified = true
            user.veryficationToken = null

            await user.save()
            const message = "Verify success, you can login now"

            dataResponse(res, 200, message, null)
        } catch (err) {
            console.log("verify user err: ", err.message)
            returnError(res, 403, err)
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
            if (!checkPassword) throw new Error("Email or password is wrong")

            if (user.isVerified === false) {
                const verificationToken = crypto.randomUUID()

                user.veryficationToken = verificationToken
                const info = {
                    path: 'verify-user',
                    subject: 'Verify account',
                    action: 'verify your account'
                }
                await user.save()
                await sendEmail(email, verificationToken, info)
                throw new Error("Account is not verified, please check your email to verify account")
            }

            const accessToken = jwtToken.createToken({
                userId: user._id,
                email: user.email,
                role: user.role,
            }, "AT")

            const refreshToken = jwtToken.createToken({
                userId: user._id,
                email: user.email,
                role: user.role
            }, "RT")

            const message = "Login success"

            dataResponse(res, 200, message, { accessToken, refreshToken, ...userDTO(user) })
        }
        catch (err) {
            console.log("user login err: ", err.message)
            returnError(res, 401, err)
        }
    },
    getUsers: async (req, res) => {
        // try {
        //     const { page, pageSize, email, name, sortBy } = req.query

        //     const filterModel = {}
        //     if (name) {
        //         filterModel.name = {
        //             $regex: lowerCaseString(trimString(name)),
        //             $options: 'i'
        //         }
        //     }
        //     if (email) {
        //         filterModel.email = {
        //             $regex: lowerCaseString(trimString(email)),
        //             $options: 'i'
        //         }
        //     }

        //     const sortModel = {}
        //     // Notice: need sort later

        //     const users = await pageSplit(ModelDb.UserModel, filterModel, page, pageSize, sortModel, undefined)
        //     if (!users) throw new Error("User not found")


        //     const data = users.data.map(data => {
        //         return userDTO(data)
        //     });

        //     users.data = data

        //     res.status(200).json({
        //         message: "Get all users success",
        //         data: users,
        //         success: true
        //     })
        // }

        // catch (err) {
        //     console.log("get all users err: ", err.message)

        //     res.status(403).json({
        //         message: err.message,
        //         success: false,
        //         data: null,
        //         err
        //     })
        // }
    },

    getUserById: async (req, res) => {
        try {
            const { id } = req.params

            const user = await ModelDb.UserModel.findOne({
                _id: id,
                isDeleted: false,
                isVerified: true
            })
            if (!user) throw new Error("User not found")

            const message = "Get user success"

            dataResponse(res, 200, message, userDTO(user))
        }
        catch (err) {
            console.log("get user by id err: ", err.message)
            returnError(res, 403, err)
        }
    },
    forgetPassword: async (req, res) => {
        try {
            const { email } = req.body
            const user = await ModelDb.UserModel.findOne({
                email,
                isDeleted: false,
                isVerified: true
            })
            if (!user) throw new Error("User not found")

            user.resetPasswordToken = crypto.randomUUID()
            user.resetPasswordExpireIn = Date.now() + 3600000
            const info = {
                path: 'reset-password',
                subject: 'Reset Password',
                action: 'reset your password'
            }
            await user.save()
            await sendEmail(email, user.resetPasswordToken, info)

            const message = "Please check your email for reset password"

            dataResponse(res, 201, message, null)
        }
        catch (err) {
            console.log("forgot password err: ", err.message)
            returnError(res, 403, err)
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { token } = req.params
            const { newPassword } = req.body

            const user = await ModelDb.UserModel.findOne({
                isDeleted: false,
                resetPasswordToken: token,
            })

            if (!user) throw new Error(`You don't have permission for this action`)
            if (user.resetPasswordExpireIn < Date.now()) throw new Error("Token is expired")

            const hashPassword = bcryptPassword.hashPassword(newPassword)

            user.password = hashPassword
            user.resetPasswordToken = null
            user.resetPasswordExpireIn = null

            await user.save()
            const message = "Reset password success"

            dataResponse(res, 200, message, null)
        }
        catch (err) {
            console.log("reset password err: ", err.message)
            returnError(res, 403, err)
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

            const message = "Change role success"

            dataResponse(res, 200, message, userDTO(currentUser))
        }
        catch (err) {
            console.log("update user by id err: ", err.message)
            returnError(res, 403, err)
        }
    },
    updateUserById: async (req, res) => {
        try {
            const { id } = req.params
            const { password, newPassword } = req.body
            const user = req.user
            if (user.userId !== id) throw new Error("You don't have permission for this action")

            const currentUser = await ModelDb.UserModel.findOne({
                _id: id,
                isDeleted: false,
            })
            if (!currentUser) throw new Error("User not found")
            if (!bcryptPassword.comparePassword(password, currentUser.password)) throw new Error("Password is incorrect")

            let hashPassword;

            if (newPassword) {
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
            for (let key of Object.keys(req.body)) {
                if (key === "password") continue;
                currentUser[key] = req.body[key]
            }

            if (hashPassword) currentUser.password = hashPassword
            if (avatar) currentUser.avatar = avatar
            const updatedUser = await ModelDb.UserModel.findByIdAndUpdate(id, currentUser, { new: true })
            const message = "Update success"

            dataResponse(res, 200, message, userDTO(updatedUser))
        }
        catch (err) {
            console.log("update user by id err: ", err.message)
            returnError(res, 403, err)
        }
    },
    deleteUserById: async (req, res) => {
        try {
            const { id } = req.params

            const user = req.user
            if (user.userId !== id) throw new Error("You don't have permission for this user")

            const currentUser = await ModelDb.UserModel.findOne({
                _id: id,
                email: user.email,
                isDeleted: false,
                isVerified: true
            })
            if (!currentUser) throw new Error("User not found")

            currentUser.isDeleted = true

            currentUser.save()
            const message = "Delete success"

            dataResponse(res, 200, message, null)
        }
        catch (err) {
            console.log("update user by id err: ", err.message)
            returnError(res, 403, err)
        }
    },
    recoverAccount: async (req, res) => {
        try {
            const { email } = req.body
            const user = await ModelDb.UserModel.findOne({
                email,
                isDeleted: true,
                isVerified: true
            })
            if (!user) throw new Error("User not found")

            user.isDeleted = false

            await user.save()

            const info = {
                subject: "Recover account",
                textOption: "Recover account successfully",
            }
            await sendEmail(user.email, undefined, info)
            const message = "Recover account success"

            dataResponse(res, 200, message, null)

        } catch (err) {
            console.log("recover account err: ", err.message)
            returnError(res, 403, err)
        }
    }
}

export default userController