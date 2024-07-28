import returnError from "../errors/error.js"
import ModelDb from "../models/model.js"
import dataResponse from '../dataResponse/data.response.js'
import billResponse from "../dataResponse/bill.js"
const billController = {
    createBill: async (req, res) => {
        try {
            const { bookingId, restaurantId, paymentMethod } = req.body
            const user = req.user
            const employee = await ModelDb.EmployeeModel.findOne({
                restaurant: restaurantId,
                _id: user.userId,
                isDeleted: false
            })
            if (!employee) throw new Error("You don't have permission for this action")

            const booking = await ModelDb.BookingModel.findOneAndUpdate({
                _id: bookingId,
                restaurant: restaurantId,
                isCheckin: true,
                isFinished: true,
                isCanceled: false,
                isDeleted: false
            }).populate('info.menu.menuItem').lean()
            if (!booking) throw new Error("No booking found")
            const billExist = await ModelDb.BillModel.findOne({
                checkinTime: booking.checkinTime
            })
            if (billExist) throw new Error("Bill has been paid")

            let totalPrice = 0
            booking.info.forEach(infoItem => {
                infoItem.menu.forEach(item => {
                    let total = 0
                    total += item.menuItem.price * item.quantity * (1 - item.menuItem.discount / 100)
                    item.total = total
                    totalPrice += total
                })
            })
            const info = booking.info.map(item => {
                return {
                    menu: item.menu.map(item => ({
                        menuItem: {
                            code: item.menuItem.code.prefix + item.menuItem.code.suffix,
                            name: item.menuItem.name,
                            type: item.menuItem.type,
                            unit: item.menuItem.unit,
                            price: item.menuItem.price,
                            discount: item.menuItem.discount,
                        },
                        quantity: item.quantity,
                        note: item.note,
                        total: item.total
                    })),
                    tableNumber: item.tableNumber
                }
            })

            const bill = await ModelDb.BillModel.create({
                paymentMethod,
                payer: {
                    firstName: booking.firstName,
                    lastName: booking.lastName,
                    phone: booking.phone
                },
                info,
                totalPrice,
                restaurant: restaurantId,
                checkinTime: booking.checkinTime
            })
            const restaurant = await ModelDb.RestaurantModel.findOne({
                _id: restaurantId,
                isDeleted: false,
                isActive: true
            })
            restaurant.numberOfTablesBookedInLastWeek++
            await restaurant.save()
            const message = "Bill created"
            dataResponse(res, 200, message, billResponse(bill))

        } catch (error) {
            console.log(error.message);
            returnError(res, 403, error)
        }
    },
    getBills: async (req, res) => {

    }
}

export default billController