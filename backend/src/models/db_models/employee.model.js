import mongoose from "mongoose";
import { collection } from "../../database/collection";

const employeeSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    phone: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    role: "employee",
    isDeleted: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordExpireIn: Number
},
    {
        timestamps: true
    }
)

const EmployeeModel = mongoose.model(collection.EMPLOYEE, employeeSchema)

export default EmployeeModel