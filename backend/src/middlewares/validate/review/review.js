import returnError from "../../../errors/error.js"
import reviewValidate from "../../../validateSchema/review/review.validate.js"

const reviewValidateData = {
    createReview: (req, res, next) => {
        try {
            const { error, value } = reviewValidate.createReview.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            req.body = value
            next()
        } catch (error) {
            returnError(res, 403, error)
        }
    },
    getReviews: (req, res, next) => {
        try {
            const { error, value } = reviewValidate.getReviews.validate(req.query)
            if (error) throw new Error(error.details[0].message)

            req.query = value

            next()
        } catch (error) {
            returnError(res, 403, error)
        }
    }
}
export default reviewValidateData