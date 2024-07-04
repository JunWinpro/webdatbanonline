import returnError from "../errors/error.js"
import ModelDb from "../models/model.js"
import dataResponse from "../dto/data.js"
import bookingDTO from "../dto/booking.dto.js"
import date from "../utils/date.util.js"
import pageSplit from "../utils/pageSplit.util.js"
const bookingController = {
    userBooking: async (req, res) => {
        try {
            const { restaurantId, checkinTime, table, numberOfTable } = req.body

            const currentRestaurant = await RestaurantInfoModel.findOne({
                restaurant: restaurantId,
                isDeleted: false,
            }).populate("restaurant")

            if (!currentRestaurant) throw new Error("Restaurant not found")
            if (!currentRestaurant.restaurant.isActive) throw new Error("Restaurant not active")

            const { hour, day } = date(checkinTime)
            const { schedule } = currentRestaurant

            if (!schedule[day].isWorkingDay) throw new Error("Restaurant not working day")

            if (hour < schedule[day].openTime || hour > schedule[day].closeTime) throw new Error("Restaurant not working time")

            const currentDate = Date.now()

            if (currentDate + 3 * 24 * 60 * 60 * 1000 > checkinTime) throw new Error("Can not booking more over 3 days")

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
                const findCheckin = await BookingModel.findOne(filter)
                if (findCheckin) throw new Error("Table already booked")

                const lastIndex = table[table.length - 1]
                if (!tableList[lastIndex - 1]) throw new Error("Last table is not exist")

                list = table
                totalOfTables = table.length
            }

            if (numberOfTable) {
                if (numberOfTable > tableList.length) throw new Error("Number of table is over than table list length")

                const findCheckin = await BookingModel.find(filter)

                const totalTable = tableList.length

                if (numberOfTable > totalTable - findCheckin.length) {
                    throw new Error(`Sorry, we don't have enough table for ${numberOfTable} tables, please try again`)
                }

                const emptyTables = tableList.filter(table => !findCheckin.includes(table))

                list = emptyTables.slice(0, numberOfTable)
                totalOfTables = numberOfTable
            }

            const booking = await BookingModel.create({
                ...req.body,
                restaurant: restaurantId,
                table: list,
                numberOfTable: totalOfTables,
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

            const currentRestaurant = await RestaurantInfoModel.findOne({
                restaurant: restaurantId,
                isDeleted: false,
            }).populate("restaurant")

            if (!currentRestaurant) throw new Error("Restaurant not found")
            if (!currentRestaurant.restaurant.isActive) throw new Error("Restaurant not active")

            const { hour, day } = date(checkinTime)

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

            const findCheckin = await BookingModel.findOne(filter)
            if (findCheckin) throw new Error("Table already booked")

            const lastIndex = table[table.length - 1]
            if (!tableList[lastIndex - 1]) throw new Error("Last table is not exist")

            list = table
            totalOfTables = table.length

            const booking = await BookingModel.create({
                ...req.body,
                restaurant: restaurantId,
                table: list,
                numberOfTable: totalOfTables,
            })

            const message = "Create booking success"
            dataResponse(res, 201, message, bookingDTO(booking))
        } catch (error) {
            returnError(res, 403, error)
        }
    },
    getBookingListByRestaurantId: async (req, res) => {
        try {
            const { id } = req.params
            const { page, pageSize, date } = req.query
            const user = req.user
            const filterModel = {
                restaurant: id,
                isDeleted: false,
            }
            if (date) {
                filterModel.checkinTime = date
            }
            const populate = {
                path: 'restaurant',
                populate: {
                    path: 'manager',
                    match: {
                        _id: user.userId,
                        isDeleted: false
                    }
                }
            }
            const booking = await pageSplit(BookingModel, filterModel, page, pageSize, {}, populate)
            if (booking.data.length === 0) throw new Error("No booking found")

            const data = {
                data: booking.data.map(booking => bookingDTO(booking)),
                totalItems: booking.totalItems,
                totalPages: booking.totalPages,
                page: booking.page
            }
            const message = "Get booking list success"
            dataResponse(res, 200, message, data)

        } catch (error) {
            returnError(res, 403, error)
        }
    },
    updateBookingById: async (req, res) => {
        try {
            const { restaurantId, checkinTime } = req.body
            const { id } = req.params
            const user = req.user

            if (user.role === "employee") {
                const employee = await EmployeeModel.findOne({
                    restaurant: restaurantId,
                    isDeleted: false,
                    _id: user.userId
                }).populate("restaurant")

                if (!employee) throw new Error("You don't have permission for this action")
                if (employee.restaurant.isDeleted) throw new Error("Restaurant not found")

            }
            const restaurantInfo = await RestaurantInfoModel.findOne({
                restaurant: restaurantId,
                isDeleted: false,
                isFinished: false,
            })

            if (!restaurantInfo) throw new Error("Restaurant Info is deleted")
            const { hour, day } = date(checkinTime)
            const { schedule } = restaurantInfo

            if (!schedule[day].isWorkingDay) throw new Error("Restaurant not working day")

            if (hour < schedule[day].openTime || hour > schedule[day].closeTime) throw new Error("Restaurant not working time")

            const bookingFilter = {
                _id: id,
                restaurant: restaurantId,
                isDeleted: false,
            }

            const booking = await BookingModel.findOne(bookingFilter)

            if (!booking) throw new Error("Booking not found")

            for (let key of Object.keys(req.body)) {
                booking[key] = req.body[key]
            }
            await booking.save()

            const message = "Update booking success"
            dataResponse(res, 200, message, bookingDTO(booking))

        } catch (error) {
            returnError(res, 403, error)
        }
    },
    bookingCheckinById: async (req, res) => {
        try {
            const { id, restaurantId } = req.params
            const user = req.user

            const employee = await EmployeeModel.findOne({
                restaurant: restaurantId,
                isDeleted: false,
                _id: user.userId
            }).populate('restaurant')

            if (!employee) throw new Error("You don't have permission for this action")
            if (employee.restaurant.isDeleted) throw new Error("Restaurant not found")

            const booking = await BookingModel.findOne({
                _id: id,
                restaurant: restaurantId,
                isDeleted: false,
                isCheckin: false,
                isFinished: false
            })

            if (!booking) throw new Error("Booking not found")

            booking.isCheckin = true

            await booking.save()

            const message = "Checkin booking success"
            dataResponse(res, 200, message, bookingDTO(booking))
        } catch (error) {
            returnError(res, 403, error)
        }
    },
    bookingFinishById: async (req, res) => {
        try {
            const { id, restaurantId } = req.params
            const user = req.user

            const employee = await EmployeeModel.findOne({
                restaurant: restaurantId,
                isDeleted: false,
                _id: user.userId
            }).populate('restaurant')

            if (!employee) throw new Error("You don't have permission for this action")
            if (employee.restaurant.isDeleted) throw new Error("Restaurant not found")

            const booking = await BookingModel.findOne({
                _id: id,
                restaurant: restaurantId,
                isDeleted: false,
                isCheckin: true,
                isFinished: false
            })

            if (!booking) throw new Error("Booking not found")

            booking.isFinished = true

            await booking.save()

            const message = "Checkin booking success"
            dataResponse(res, 200, message, bookingDTO(booking))
        } catch (error) {
            returnError(res, 403, error)
        }
    },
    deleteBookingById: async (req, res) => {
        try {
            const { id } = req.params
            const findBooking = await BookingModel.findOne({
                _id: id,
                isCheckin: false,
                isFinished: false,
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