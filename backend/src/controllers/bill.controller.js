import returnError from "../errors/error.js"
import ModelDb from "../models/model.js"
const billController = {
    createBill: async (req, res) => {
        try {
            const { restaurantId, bookingId } = req.body

            const booking = await ModelDb.BookingModel.findOne({
                _id: bookingId,
                restaurant: restaurantId,
                isDeleted: false,
                isCheckin: true,
                isFinished: true
            }).populate('menu.menuItem')

            if (!booking) throw new Error("This booking does not exist")

            const { menu } = booking


        } catch (error) {
            returnError(res, 403, error)
        }
    }
}

export default billController