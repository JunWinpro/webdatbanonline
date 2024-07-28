import returnError from "../../../errors/error.js"
import billValidate from "../../../validateSchema/bill/bill.validate.js"

const billValidateData = {
    createBill: (req, res, next) => {
        try {
            const { error, value } = billValidate.createBill.validate(req.body)
            if (error) throw new Error(error.details[0].message)
            req.body = value
            next()
        } catch (error) {
            returnError(res, 403, error)
        }
    }
}

export default billValidateData
