import returnError from "../errors/error.js"
import ModelDb from "../models/model.js"
const billController = {
    createBill: async (req, res) => {
        try {
            const { restaurantId, bookingId, checkedBy } = req.body

            const employee = await ModelDb.EmployeeModel.findOne({
                restaurant: restaurantId,
                isDeleted: false,
                _id: checkedBy
            }).lean()

            if (!employee) throw new Error("Employee not found")

            const booking = await ModelDb.BookingModel.findOne({
                _id: bookingId,
                restaurant: restaurantId,
                isDeleted: false,
                isCheckin: true,
                isFinished: true
            }).populate('menu.menuItem')

            if (!booking) throw new Error("This booking does not exist")

            if (booking.menu.menuItem.length === 0) throw new Error("Menu is empty")
            if (booking.table.length === 0) throw new Error("Table is empty")

            let totalPrice = 0
            for (let i = 0; i < booking.menu.menuItem.length; i++) {
                const menuItem = booking.menu.menuItem[i]
                totalPrice += menuItem.price * booking.menu.quantity[i]
            }

            const bill = await ModelDb.BookingModel.create({
                ...req.body,
                restaurant: restaurantId,
                booking: bookingId,
                payer: {
                    firstName: booking.firstName || null,
                    lastName: booking.lastName || null,
                    phone: booking.phone || null
                },
                table: booking.table,
                totalPrice,
            })


        } catch (error) {
            returnError(res, 403, error)
        }
    }
}

export default billController