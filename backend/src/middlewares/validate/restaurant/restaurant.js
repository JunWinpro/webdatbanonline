import restaurantValidate from "../../../validateSchema/restaurant.validate.js"
import convertUnicode from "../../../validateSchema/unidecode.js"

const restaurantValidateData = {
    createRestaurant: (req, res, next) => {
        try {
            const { error, value } = restaurantValidate.createRestaurant.validate(req.body)
            console.log(error && error?.details)
            if (error) throw new Error(error.details[0].message)

            req.body = value
            next()
        }
        catch (err) {
            res.status(403).json({
                message: err.message,
                success: false,
                data: null,
                err
            })
        }
    },

    getRestaurants: (req, res, next) => {
        try {
            const { error, value } = restaurantValidate.getRestaurants.validate(req.query)
            console.log(error && error)
            console.log(value)
            if (error) throw new Error(error.details[0].message)
            req.query = value

            next()
        }
        catch (err) {
            res.status(403).json({
                message: err.message,
                success: false,
                data: null,
                err
            })
        }
    }
}

export default restaurantValidateData