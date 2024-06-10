import transporter from "../configs/transporter.config.js"
import ModelDb from "../models/model.js"
import bcryptPassword from "../utils/bcrypt.util.js"
import jwtToken from "../utils/jwtToken.util.js"
import { v2 as cloudinary } from "cloudinary"
import pageSplit from "../utils/pageSplit.util.js"
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

            if (userExist?.email === email) throw new Error("Email already used")
            if (userExist?.phone === phone) throw new Error("Phone already used")

            const employeeExist = await ModelDb.EmployeeModel.findOne({
                phone
            })
            if (employeeExist) throw new Error("Phone already used")

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
            if (!checkPassword) throw new Error("Email or password is wrong")

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
            }, "RT")

            delete returnUser.password
            delete returnUser.createdAt
            delete returnUser.updatedAt

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

    getAllUsers: async (req, res) => {
        try {
            const { page, pageSize, search, sortBy } = req.query

            let filterModel = {}
            if (search) {
                formatSearch = search.split("-").join(" ")
                filterModel.formatSearch = formatSearch
            }


            const allUsers = await pageSplit(ModelDb.UserModel, page, pageSize, filterModel, undefined, sortBy)
            if (!allUsers) throw new Error("User not found")

            const returnUser = allUsers.data.map(user => {
                const { password, resetPasswordExpireIn, resetPasswordToken, ...returnUser } = user.toObject();
                return returnUser
            });

            allUsers.data = returnUser

            res.status(200).json({
                message: "Get all users success",
                data: allUsers,
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
            delete returnUser.resetPasswordToken
            delete returnUser.resetPasswordExpireIn


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

            let currentUser = await ModelDb.UserModel.findOne({
                _id: id,
                isDeleted: false,
            })
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
    forgetPassword: async (req, res) => {
        try {
            const { email } = req.body
            const user = await ModelDb.UserModel.findOne({
                email,
                isDeleted: false
            })
            if (!user) throw new Error("User not found")

            const sendEmail = async (email, token) => {
                const url = `http://${process.env.CLIENT_URL || 'localhost:3000'}/${token}`

                let mailOptions = {
                    from: `Taste Tripper <${process.env.GMAIL_USERNAME}>`,
                    to: email,
                    subject: 'Reset Password',
                    text: `Click on the following link to reset your password: ${url}`
                };

                await transporter.sendMail(mailOptions);
            }

            user.resetPasswordToken = crypto.randomUUID()
            user.resetPasswordExpireIn = Date.now() + 3600000

            await user.save()
            await sendEmail(email, user.resetPasswordToken)
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
    confirmResetPassword: async (req, res) => {
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
            })
            if (!user) throw new Error('User not found')

            if (user.resetPasswordExpireIn <= Date.now()) {

                user.resetPasswordToken = undefined
                user.resetPasswordExpireIn = undefined
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
            user.resetPasswordToken = undefined
            user.resetPasswordExpireIn = undefined

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