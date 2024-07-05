import returnError from "../errors/error"

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
            })

            if (!booking) throw new Error("This booking does not exist")

        } catch (error) {
            returnError(res, 403, error)
        }

    }
}