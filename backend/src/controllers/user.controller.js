import Models from "../models/model.js";

const userController = {
    register: (req, res) => {
        const { email, phone, username, password, } = req.body;
        const avatar = req.file
        const userExist = Models.UserModel.findOne({
            $or: [
                { email },
                { phone },
                { username }
            ]
        })
        const employeeExist = Models.EmployeeModel.findOne({
            phone,
            username
        })
    },
    login: (req, res) => {

    },

}

export default userController