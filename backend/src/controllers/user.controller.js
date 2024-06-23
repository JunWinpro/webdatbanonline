import ModelDb from "../models/model.js"
import bcryptPassword from "../utils/bcrypt.util.js"
import jwtToken from "../utils/jwtToken.util.js"
import { v2 as cloudinary } from "cloudinary"
import pageSplit from "../utils/pageSplit.util.js"
import sendEmail from "../utils/sendEmail.js"
import returnUser from "../dto/user.dto.js"
import lowerCaseString from "../utils/lowerCaseString.js"
import trimString from "../utils/trimString.js"
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

            await ModelDb.UserModel.create({
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

            res.status(201).json({
                message: "Please check your email for verify account",
                data: null,
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
            res.status(201).json({
                success: true,
                data: null,
                message: "Verify success, you can login now"
            })

        } catch (error) {
            console.log("verify user err: ", error)
            res.status(403).json({
                message: error.message,
                success: false,
                data: null
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
                throw new Error("Account is not verified, please check your email for verify account")
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

            res.status(201).json({
                message: "Login success",
                data: {
                    userInfo: returnUser(user),
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
                data: null,
                err
            })
        }
    },
    getUsers: async (req, res) => {
        try {
            const { page, pageSize, email, name, sortBy } = req.query

            const filterModel = {}
            if (name) {
                filterModel.name = {
                    $regex: lowerCaseString(trimString(name)),
                    $options: 'i'
                }
            }
            if (email) {
                filterModel.email = {
                    $regex: lowerCaseString(trimString(email)),
                    $options: 'i'
                }
            }

            const sortModel = {}
            // Notice: need sort later

            const users = await pageSplit(ModelDb.UserModel, filterModel, page, pageSize, sortModel, undefined)
            if (!users) throw new Error("User not found")


            const data = users.data.map(data => {
                return returnUser(data)
            });

            users.data = data

            res.status(200).json({
                message: "Get all users success",
                data: users,
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
                isDeleted: false,
                isVerified: true
            })
            if (!user) throw new Error("User not found")

            res.status(200).json({
                message: "Get user success",
                data: returnUser(user),
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

            res.status(201).json({
                message: "Please check your email for reset password",
                success: true,
                data: null,
            })
        }
        catch (err) {
            console.log("forgot password err: ", err)
            res.status(403).json({
                message: err.message,
                success: false,
                data: null,
                err
            })
        }
    },
    validateResetPasswordToken: async (req, res) => {
        try {
            const { token } = req.params

            if (!token) {
                return res.status(400).json({
                    message: "Token is required",
                    success: false
                })
            }

            const user = await ModelDb.UserModel.findOne({
                resetPasswordToken: token,
                isDeleted: false,
                isVerified: true
            })
            if (!user) throw new Error('User not found')

            if (user.resetPasswordExpireIn <= Date.now()) {

                user.resetPasswordToken = null
                user.resetPasswordExpireIn = null
                await user.save()

                throw new Error('Token expired')
            }

            res.status(201).json({
                message: "Token is valid",
                success: true,
                data: {
                    email: user.email
                }
            })
        }
        catch (err) {
            console.log("reset password err: ", err)
            res.status(403).json({
                message: err.message,
                success: false,
                data: null,
                err
            })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { token } = req.params
            const { newPassword } = req.body

            const user = await ModelDb.UserModel.findOne({
                isDeleted: false,
                resetPasswordToken: token,
                resetPasswordExpireIn: { $gt: Date.now() }
            })

            if (!user) throw new Error(`Wrong user`)

            const hashPassword = bcryptPassword.hashPassword(newPassword)

            user.password = hashPassword
            user.resetPasswordToken = null
            user.resetPasswordExpireIn = null

            await user.save()
            res.status(201).json({
                message: "Reset password success",
                data: null,
                success: true
            })
        }
        catch (err) {
            console.log("reset password err: ", err)
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
    updateUserById: async (req, res) => {
        try {
            const { id } = req.params
            const { password, newPassword } = req.body
            const user = req.user
            if (user.userId !== id) throw new Error("You don't have permission for this action")

            let currentUser = await ModelDb.UserModel.findOne({
                _id: id,
                isDeleted: false,
            })
            if (!currentUser) throw new Error("User not found")

            let hashPassword;
            if (password && newPassword) {
                if (!bcryptPassword.comparePassword(password, currentUser.password)) throw new Error("Password is incorrect")
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

            res.status(201).json({
                message: "Update user success",
                data: returnUser(updatedUser),
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

            res.status(201).json({
                success: true,
                data: null,
                message: "Recover account success"
            })

        } catch (error) {
            console.log("recover account err: ", error)
            res.status(403).json({
                message: error.message,
                success: false,
                data: null
            })
        }
    }
}

export default userController