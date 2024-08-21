import returnError from "../../../errors/error.js"
import restaurantValidate from "../../../validateSchema/restaurant/restaurant.validate.js"
import districts from "../../../jsonDb/districts.json" with {type: "json"}

const restaurantValidateData = {
    createRestaurant: (req, res, next) => {
        try {
            const { error, value } = restaurantValidate.createRestaurant.validate(req.body)
            if (error) throw new Error(error.details[0].message)
            if (!districts.find(item => item.parent_code === value.city && item.code === value.district)) throw new Error("District code must be a child of city")
            req.body = value
            next()
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },
    updateRestaurantById: (req, res, next) => {
        try {
            const { error, value } = restaurantValidate.updateRestaurant.validate(req.body)
            if (error) throw new Error(error.details[0].message)
            if (Object.keys(value).length === 0) throw new Error("Please input a valid value")
            req.body = value
            next()
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },
    updateRestaurantInfoById: (req, res, next) => {
        try {
            const { error, value } = restaurantValidate.updateRestaurantInfo.validate(req.body)
            if (error) throw new Error(error.details[0].message)

            req.body = value
            next()
        } catch (error) {
            returnError(res, 403, error)
        }
    }
}

export default restaurantValidateData