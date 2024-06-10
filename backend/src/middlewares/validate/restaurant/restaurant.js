import restaurantValidate from "../../../validateSchema/restaurant.validate.js"

const restaurantValidateData = {
    createRestaurant: (req, res, next) => {
        try {
            const { error, value } = restaurantValidate.createRestaurant.validate(req.body)

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
    }
}

export default restaurantValidateData