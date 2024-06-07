import ModelDb from "../models/model.js";
import mongoose from "mongoose";
import bcryptPassword from "../utils/bcrypt.util.js";
import jwtToken from "../utils/jwtToken.util.js";

const employeeController = {
    register: async (req, res) => {
        try {
            const { username, phone, password } = req.body;
            const user = req.user

            const userExist = await ModelDb.EmployeeModel.findOne({
                $or: [
                    { username },
                    { phone },
                ],
            })

            if (userExist?.username === username) throw new Error("Username already used")
            if (userExist?.phone === phone) throw new Error("Phone already used")

            const userPhoneExist = await ModelDb.UserModel.findOne({
                phone
            })
            if (userPhoneExist) throw new Error("Phone already used")

            const getLatestEmployeeId = await ModelDb.EmployeeModel.findOne({
                manager: user.userId
            }).sort({
                'employeeId.suffix': -1
            })

            const hashPassword = bcryptPassword.hashPassword(password)

            const newUser = await ModelDb.EmployeeModel.create({
                ...req.body,
                password: hashPassword,
                manager: new mongoose.Types.ObjectId(user.userId),
                employeeId: {
                    suffix: getLatestEmployeeId ? getLatestEmployeeId.employeeId.suffix + 1 : 1
                }
            })

            const returnUser = { ...newUser.toObject() }

            delete returnUser.password

            res.status(201).json({
                message: "Employee created successfully",
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
            const { password } = req.body
            const username = req.username
            const phone = req.phone
            const loginMethod = async (method) => {
                return await ModelDb.EmployeeModel.findOne({
                    $or: [
                        { username: method },
                        { phone: method },
                    ],
                    isDeleted: false,
                })
            }

            const user = await loginMethod(username || phone)
            if (!user) throw new Error("Username/phone or password is wrong")

            const checkPassword = bcryptPassword.comparePassword(password, user.password)
            if (!checkPassword) throw new Error("Username/phone or password is wrong")

            const returnUser = { ...user.toObject() }

            const accessToken = jwtToken.createToken({
                userId: returnUser._id,
                username: returnUser.username,
                phone: returnUser.phone,
            }, "AT")

            const refreshToken = jwtToken.createToken({
                userId: returnUser._id,
                username: returnUser.username,
                phone: returnUser.phone,

            }, "RT")

            delete returnUser.password

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

    getAllEmployees: async (req, res) => {
        try {
            const { page, pageSize, filter, search, sortBy } = req.query

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

    getEmployeeById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user
            const employee = await ModelDb.EmployeeModel.findOne({
                _id: id,
                manager: new mongoose.Types.ObjectId(user.userId),
                isDeleted: false
            })
            if (!employee) throw new Error("Employee not found")

            const returnEmployee = { ...employee.toObject() }

            delete returnEmployee.password

            res.status(200).json({
                message: "Get Employee success",
                data: returnEmployee,
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
    deleteEmployeeById: async (_, res) => {
        try {
            const { id } = req.params
            const user = req.user

            const currentUser = await ModelDb.EmployeeModel.findOne({
                _id: id,
                manager: new mongoose.Types.ObjectId(user.userId),
                isDeleted: false
            })
            if (!currentUser) throw new Error("You don't have permission for this user")
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

export default employeeController