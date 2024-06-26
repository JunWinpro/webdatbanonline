import ModelDb from "../models/model.js";
import mongoose from "mongoose";
import bcryptPassword from "../utils/bcrypt.util.js";
import jwtToken from "../utils/jwtToken.util.js";
import returnEmployee from "../dto/employee.dto.js";

const employeeController = {
    register: async (req, res) => {
        try {
            const { username, phone, password, } = req.body;
            const { restaurantId } = req.params
            const user = req.user

            const restaurant = await ModelDb.RestaurantModel.findOne({
                _id: restaurantId,
                manager: new mongoose.Types.ObjectId(user.userId),
                isDeleted: false,
                isVerified: true
            })

            if (!restaurant) throw new Error("You don't have permission for this action")

            const userExist = await ModelDb.EmployeeModel.findOne({
                $or: [
                    { username },
                    { phone },
                ],
                isDeleted: false
            })

            if (userExist?.username === username) throw new Error("Username already used")
            if (userExist?.phone === phone) throw new Error("Phone already used")

            const userPhoneExist = await ModelDb.UserModel.findOne({
                phone,
                isDeleted: false
            })
            if (userPhoneExist) throw new Error("Phone already used")

            const getLatestEmployeeId = await ModelDb.EmployeeModel.findOne({
                manager: user.userId,
                isDeleted: false
            }).sort({
                'employeeId.suffix': -1
            })

            const hashPassword = bcryptPassword.hashPassword(password)

            const newEployee = await ModelDb.EmployeeModel.create({
                ...req.body,
                password: hashPassword,
                manager: new mongoose.Types.ObjectId(user.userId),
                employeeId: {
                    suffix: getLatestEmployeeId ? getLatestEmployeeId.employeeId.suffix + 1 : 1
                },
                restaurant: new mongoose.Types.ObjectId(restaurantId)
            })
            const message = "Register success"
            returnEmployee(200, message, newEployee)
        }
        catch (err) {
            console.log("user register err: ", err)
            returnError(err, 403)
        }
    },

    login: async (req, res) => {
        try {
            const { password } = req.body
            const loginMethod = req.loginMethod
            const employee = await ModelDb.EmployeeModel.findOne({
                $or: [
                    { username: loginMethod },
                    { phone: loginMethod },
                ],
                isDeleted: false,
            }).populate('restaurant')
            const user = req.user

            if (!employee) throw new Error("Username/phone or password is wrong")

            const checkPassword = bcryptPassword.comparePassword(password, user.password)
            if (!checkPassword) throw new Error("Username/phone or password is wrong")

            const accessToken = jwtToken.createToken({
                userId: user._id,
                username: employee.username,
                role: employee.role
            }, "AT")

            const refreshToken = jwtToken.createToken({
                userId: user._id,
                username: employee.username,
                role: employee.role
            }, "RT")
            const message = "Login success"
            returnEmployee(200, message, employee, { accessToken, refreshToken })
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

    getEmployees: async (req, res) => {
        try {
            const { page, pageSize, filter, search, sortBy } = req.query
            const user = req.user
            const employees = await ModelDb.UserModel.find({
                isDeleted: false,
                manager: new mongoose.Types.ObjectId(user.userId)
            })
            if (!employees) throw new Error("User not found")

            const returnEmployees = employees.map(employee => returnEmployee(employee));

            res.status(200).json({
                message: "Get all users success",
                data: returnEmployees,
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

            res.status(200).json({
                message: "Get Employee success",
                data: returnEmployee(employee),
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
    updateEmployeeById: async (req, res) => {
        try {
            const { password, newPassword } = req.body
            const user = req.user
            const currentUser = await ModelDb.EmployeeModel.findOne({
                _id: user.userId,
                isDeleted: false
            })
            if (!currentUser) throw new Error("You don't have permission for this action")

            const checkPassword = bcryptPassword.comparePassword(password, currentUser.password)
            if (!checkPassword) throw new Error("Password is wrong")

            const checkNewPassword = bcryptPassword.comparePassword(newPassword, currentUser.password)
            if (!checkNewPassword) throw new Error("New password must be different from old password")

            const hashPassword = bcryptPassword.hashPassword(newPassword)

            currentUser.password = hashPassword
            await currentUser.save()
            res.status(201).json({
                success: true,
                data: null,
                message: "Update password success"
            })
        } catch (error) {
            console.log("update user by id err: ", error)
            res.status(403).json({
                message: error.message,
                success: false,
                data: null
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

            await currentUser.save()
            res.status(201).json({
                success: true,
                data: null,
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