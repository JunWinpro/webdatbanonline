import returnError from "../errors/error.js"
import ModelDb from "../models/model.js"
import dataResponse from "../dto/data.js"
import bookingDTO from "../dto/booking.dto.js"
import date from "../utils/date.util.js"
const bookingController = {
    userBooking: async (req, res) => {
        try {
            const { restaurantId, checkinTime, table, numberOfTable } = req.body

            const currentRestaurant = await ModelDb.RestaurantInfoModel.findOne({
                restaurant: restaurantId,
                isDeleted: false,
            }).populate("restaurant")

            if (!currentRestaurant) throw new Error("Restaurant not found")
            if (!currentRestaurant.restaurant.isActive) throw new Error("Restaurant not active")

            const { second, minutes, hour, day } = date(checkinTime)
            const acceptMinute = [0, 15, 30, 45]
            if (!acceptMinute.includes(minutes)) throw new Error("Minutes are not correct")
            if (second !== 0) throw new Error("Second is not correct")

            const { schedule } = currentRestaurant

            if (!schedule[day].isWorkingDay) throw new Error("Restaurant not working day")

            if (hour < schedule[day].openTime || hour > schedule[day].closeTime) throw new Error("Restaurant not working time")

            const filter = {
                restaurant: restaurantId,
                checkinTime: {
                    $gte: checkinTime - 30 * 60 * 1000,
                    $lte: checkinTime
                },
                isFinished: false
            }

            let totalOfTables = 0
            let list = []
            const { tableList } = currentRestaurant

            if (table) {
                filter.table = {
                    $in: table
                }
                const findCheckin = await ModelDb.BookingModel.findOne(filter)
                if (findCheckin) throw new Error("Table already booked")

                const lastIndex = table[table.length - 1]
                if (!tableList[lastIndex - 1]) throw new Error("Last table is not exist")

                list = table
                totalOfTables = table.length
            }

            if (numberOfTable) {
                if (numberOfTable > tableList.length) throw new Error("Number of table is over than table list length")

                const findCheckin = await ModelDb.BookingModel.find(filter)

                const totalTable = tableList.length

                if (numberOfTable > totalTable - findCheckin.length) {
                    throw new Error(`Sorry, we don't have enough table for ${numberOfTable} tables, please try again`)
                }

                const emptyTables = tableList.filter(table => !findCheckin.includes(table))

                list = emptyTables.slice(0, numberOfTable)
                totalOfTables = numberOfTable
            }

            const booking = await ModelDb.BookingModel.create({
                ...req.body,
                restaurant: restaurantId,
                table: list,
                numberOfTable: totalOfTables
            })

            const message = "Create booking success"
            dataResponse(res, 201, message, bookingDTO(booking))

        } catch (error) {
            returnError(res, 403, error)
        }
    },

    employeeBooking: async (req, res) => {
        try {
            const { restaurantId, checkinTime, table } = req.body

            const currentRestaurant = await ModelDb.RestaurantInfoModel.findOne({
                restaurant: restaurantId,
                isDeleted: false,
            }).populate("restaurant")

            if (!currentRestaurant) throw new Error("Restaurant not found")
            if (!currentRestaurant.restaurant.isActive) throw new Error("Restaurant not active")

            const { second, minutes, hour, day } = date(checkinTime)

            const acceptMinute = [0, 15, 30, 45]
            if (!acceptMinute.includes(minutes)) throw new Error("Minutes are not correct")
            if (second !== 0) throw new Error("Second is not correct")

            const { schedule } = currentRestaurant

            if (!schedule[day].isWorkingDay) throw new Error("Restaurant not working day")
            if (hour < schedule[day].openTime || hour > schedule[day].closeTime) throw new Error("Restaurant not working time")

            const filter = {
                checkinTime: checkinTime,
                isFinished: false,
                isDeleted: false,
                isCheckin: false,
                table: {
                    $in: table
                }
            }

            let totalOfTables = 0
            let list = []
            const { tableList } = currentRestaurant

            const findCheckin = await ModelDb.BookingModel.findOne(filter)
            if (findCheckin) throw new Error("Table already booked")

            const lastIndex = table[table.length - 1]
            if (!tableList[lastIndex - 1]) throw new Error("Last table is not exist")

            list = table
            totalOfTables = table.length

            const booking = await ModelDb.BookingModel.create({
                ...req.body,
                restaurant: restaurantId,
                table: list,
                numberOfTable: totalOfTables
            })

            const message = "Create booking success"
            dataResponse(res, 201, message, bookingDTO(booking))
        } catch (error) {
            returnError(res, 403, error)
        }
    },

    getBookingList: async (req, res) => {
        try {

        } catch (error) {
            returnError(res, 403, error)
        }
    },

    getBookingById: async (req, res) => {
        try {

        } catch (error) {
            returnError(res, 403, error)
        }
    },

    updateBookingStatusById: async (req, res) => {
        try {

        } catch (error) {
            returnError(res, 403, error)
        }
    },

    deleteBookingById: async (req, res) => {
        try {
            const { id } = req.params
            const findBooking = await ModelDb.BookingModel.findOne({
                _id: id,
                isCheckin: true,
                isFinished: true,
                isDeleted: false
            })
            if (!findBooking) throw new Error("Booking not found")

            findBooking.isDeleted = true
            await findBooking.save()

            const message = "Delete booking success"
            dataResponse(res, 200, message)
        } catch (error) {
            returnError(res, 403, error)
        }
    }
}

export default bookingController