import ModelDb from "../models/model.js";
import bcryptPassword from "../utils/bcrypt.util.js";
import jwtToken from "../utils/jwtToken.util.js";
import employeeResponse from "../dataResponse/employee.js";
import dataResponse from "../dataResponse/data.response.js";
import returnError from "../errors/error.js";
import duplicateErr from "../errors/duplicate.js";

const employeeController = {
    register: async (req, res) => {
        try {
            const { username, phone, password, restaurantId } = req.body;
            const user = req.user

            const restaurant = await ModelDb.RestaurantModel.findOne({
                _id: restaurantId,
                manager: user.userId,
                isDeleted: false,
            })

            if (!restaurant) throw new Error("You don't have permission for this action")

            const employeeExist = await ModelDb.EmployeeModel.findOne({
                $or: [
                    { username },
                    { phone },
                ],
                isDeleted: false
            })

            if (employeeExist?.username === username) throw new Error("Username already used")
            if (employeeExist?.phone === phone) throw new Error("Phone already used")

            const userExist = await ModelDb.UserModel.findOne({
                phone,
                isDeleted: false
            })
            if (userExist) throw new Error("Phone already used")

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
                manager: user.userId,
                employeeId: {
                    suffix: getLatestEmployeeId ? getLatestEmployeeId.employeeId.suffix + 1 : 1
                },
                restaurant: restaurantId
            })

            const message = "Register success"
            dataResponse(res, 200, message, employeeResponse(newEployee))
        }
        catch (err) {
            console.log("employee register err: ", err)
            returnError(res, 403, err)
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
            })

            if (!employee) throw new Error("Username/phone or password is wrong")

            const checkPassword = bcryptPassword.comparePassword(password, employee.password)
            if (!checkPassword) throw new Error("Username/phone or password is wrong")

            const accessToken = jwtToken.createToken({
                userId: employee._id,
                username: employee.username,
                role: employee.role
            }, "AT")

            const refreshToken = jwtToken.createToken({
                userId: employee._id,
                username: employee.username,
                role: employee.role
            }, "RT")

            const message = "Login success"
            dataResponse(res, 200, message, { accessToken, refreshToken, ...employeeResponse(employee) })
        }
        catch (err) {
            console.log("user login err: ", err)
            returnError(res, 401, err)
        }
    },

    getEmployees: async (req, res) => {
        try {
            const { page, pageSize, filter, search, sortBy, restaurant } = req.query
            const user = req.user

            const filterModel = {}

            const employees = await ModelDb.EmployeeModel.find({
                isDeleted: false,
                manager: user.userId
            })
            console.log(employees);

            if (employees.length === 0) throw new Error("User not found")

            const data = employees.map(employee => employeeResponse(employee));

            const message = "Get employees success"
            dataResponse(res, 200, message, data)
        }

        catch (err) {
            console.log("get all users err: ", err)

            returnError(res, 403, err)
        }
    },

    getEmployeeById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user
            const employee = await ModelDb.EmployeeModel.findOne({
                _id: id,
                manager: user.userId,
                isDeleted: false
            })
            if (!employee) throw new Error("Employee not found")

            const message = "Get employee success"

            dataResponse(res, 200, message, employeeResponse(employee))
        }
        catch (err) {
            console.log("get user by id err")
            returnError(res, 403, err)
        }
    },
    updateEmployeePasswordById: async (req, res) => {
        try {
            const { password, newPassword } = req.body
            const user = req.user
            const employee = await ModelDb.EmployeeModel.findOne({
                _id: user.userId,
                isDeleted: false
            })
            if (!employee) throw new Error("You don't have permission for this action")

            if (!bcryptPassword.comparePassword(password, employee.password)) throw new Error("Password is wrong")

            if (bcryptPassword.comparePassword(newPassword, employee.password)) throw new Error("New password must be different from old password")


            const hashPassword = bcryptPassword.hashPassword(newPassword)

            employee.password = hashPassword

            await employee.save()
            const message = "Update password success"
            dataResponse(res, 200, message, employeeResponse(employee))
        } catch (error) {
            console.log("update user by id err: ", error)
            returnError(res, 403, error)
        }
    },
    updateEmployeeInfoById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user
            const employee = await ModelDb.EmployeeModel.findOne({
                _id: id,
                manager: user.userId,
                isDeleted: false
            })
            if (!employee) throw new Error("You don't have permission for action")
            for (let key of Object.keys(req.body)) {
                employee[key] = req.body[key]
            }
            await employee.save()
            const message = "Update employee success"

            dataResponse(res, 200, message, employeeResponse(employee))
        }
        catch (err) {
            returnError(res, 403, duplicateErr(err))
        }

    },
    deleteEmployeeById: async (_, res) => {
        try {
            const { id } = req.params
            const user = req.user

            const currentUser = await ModelDb.EmployeeModel.findOne({
                _id: id,
                manager: user.userId,
                isDeleted: false
            })
            if (!currentUser) throw new Error("You don't have permission for this user")
            currentUser.isDeleted = true

            await currentUser.save()
            const message = "Delete employee success"

            dataResponse(res, 200, message)
        }
        catch (err) {
            console.log("update user by id err: ", err)
            returnError(res, 403, err)
        }
    }

}

export default employeeController