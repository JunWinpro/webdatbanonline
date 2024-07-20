import returnError from "../errors/error.js"
import ModelDb from "../models/model.js"
import dataResponse from "../dataResponse/data.response.js"
import bookingResponse from "../dataResponse/booking.js"
import date from "../utils/date.util.js"
import pageSplit from "../utils/pageSplit.util.js"
const bookingController = {
    createBooking: async (req, res) => {
        try {
            const { restaurantId, checkinTime, info } = req.body

            const currentRestaurant = await ModelDb.RestaurantInfoModel.findOne({
                restaurant: restaurantId,
                isDeleted: false,
            }).populate("restaurant").lean()

            if (!currentRestaurant) throw new Error("Restaurant not found")
            if (!currentRestaurant.restaurant.isActive) throw new Error("Restaurant not active")

            const { hour, day } = date(checkinTime)
            const { schedule } = currentRestaurant

            if (!schedule[day].isWorkingDay) throw new Error("Restaurant not working day")

            if (hour < schedule[day].openTime || hour > schedule[day].closeTime) throw new Error("Restaurant not working time")

            const infoMenuList = info.filter(item => item.menu?.length > 0)

            if (infoMenuList.length !== 0) {
                const menuItems = [...new Set(infoMenuList.map(item =>
                    item.menu?.map(item => [item.menuItem])).join(',').split(','))]
                const checkMenus = await ModelDb.MenuModel.find({
                    _id: { $in: menuItems },
                    restaurant: restaurantId,
                    isDeleted: false,
                })
                if (checkMenus.length !== menuItems.length) throw new Error("Some menus can't be served or not found, please select again")
            }

            const tableList = info.map(item => item.tableNumber)

            const { totalTable } = currentRestaurant
            if (tableList[tableList.length - 1] > totalTable) throw new Error(`Table number ${tableList[tableList.length - 1]} is out of range, please select again`)
            if (tableList.length > totalTable) throw new Error("Not enough table, please select again")
            const user = req.user

            const filter = {
                restaurant: restaurantId,
                'info.tableNumber': { $in: tableList },
                isDeleted: false,
                isCheckin: false,
                isFinished: false,
                isCanceled: false
            }

            if (user.role === 'user') {
                filter.checkinTime = {
                    $gte: checkinTime - 30 * 60 * 1000,
                    $lte: checkinTime + 30 * 60 * 1000,
                }
            } else if (user.role === "employee" || user.role === "manager") {
                if (user.role === "employee") {
                    const employee = await ModelDb.EmployeeModel.findOne({
                        _id: user.userId,
                        restaurant: restaurantId,
                        isDeleted: false
                    }).lean()
                    if (!employee) throw new Error("You don't have permission for this action")
                }
                if (user.role === "manager") {
                    const restaurant = await ModelDb.RestaurantModel.findOne({
                        _id: restaurantId,
                        manager: user.userId,
                        isDeleted: false
                    }).lean()
                    if (!restaurant) throw new Error("You don't have permission for this action")
                }
                filter.checkinTime = {
                    $lte: checkinTime + 3 * 60 * 60 * 1000,
                }
            }

            const checkBooking = await ModelDb.BookingModel.findOne(filter)
            if (checkBooking) throw new Error(`Table is not available at this checkin time, please select again`)

            const booking = await ModelDb.BookingModel.create({
                ...req.body,
                restaurant: restaurantId,
            })

            const message = "Create booking success"
            dataResponse(res, 201, message, bookingResponse(booking))

        } catch (error) {
            returnError(res, 403, error)
        }
    },
    getBookings: async (req, res) => {
        try {
            const { restaurantId } = req.params
            const { page, pageSize } = req.query
            const user = req.user

            if (user.role === "employee") {
                const employee = await ModelDb.EmployeeModel.findOne({
                    _id: user.userId,
                    restaurant: restaurantId,
                    isDeleted: false
                }).lean()
                if (!employee) throw new Error("You don't have permission for this action")
            }
            if (user.role === "manager") {
                const restaurant = await ModelDb.RestaurantModel.findOne({
                    _id: restaurantId,
                    manager: user.userId,
                    isDeleted: false
                }).lean()
                if (!restaurant) throw new Error("You don't have permission for this action")
            }

            const filterModel = {}

            for (let key of Object.keys(req.query)) {
                if (key === 'tableNumber') {
                    filterModel['info.tableNumber'] = req.query[key]
                }
                if (key === "restaurantId") {
                    filterModel.restaurant = req.query[key]
                }
                filterModel[key] = req.query[key]
            }
            const sortModel = {
                checkinTime: -1
            }

            const bookings = await pageSplit(ModelDb.BookingModel, filterModel, page, pageSize, sortModel, populated)
            if (bookings.length === 0) throw new Error("No booking found")

            const message = "Get bookings success"
            dataResponse(res, 200, message, {
                ...bookings,
                data: bookings.data.map(booking => bookingResponse(booking))
            })
        } catch (error) {
            returnError(res, 403, error)
        }
    },
    getBookingById: async (req, res) => {
        try {
            const { id } = req.params
            const booking = await ModelDb.BookingModel.findOne({
                _id: id,
                isDeleted: false
            }).populate('restaurant').lean()
            if (!booking) throw new Error("Booking not found")
            const user = req.user
            if (user.role === "employee") {
                const employee = await ModelDb.EmployeeModel.findOne({
                    _id: user.userId,
                    restaurant: booking.restaurant._id,
                    isDeleted: false
                }).lean()
                if (!employee) throw new Error("You don't have permission for this action")
            }
            if (user.role === "manager") {
                const restaurant = await ModelDb.RestaurantModel.findOne({
                    _id: booking.restaurant._id,
                    isDeleted: false,
                    manager: user.userId
                }).populate('manager').lean()
                if (!restaurant || restaurant.manager.isDeleted) throw new Error("You don't have permission for this action")
            }

            const message = "Get booking success"
            dataResponse(res, 200, message, bookingResponse(booking))

        } catch (error) {
            returnError(res, 403, error)
        }
    },
    updateBookingInfo: async (req, res) => {
        try {
            const { restaurantId } = req.body
            const { id } = req.params

            const user = req.user
            console.log(user.userId);
            const employee = await ModelDb.EmployeeModel.findOne({
                restaurant: restaurantId,
                isDeleted: false,
                _id: user.userId
            }).lean()
            if (!employee) throw new Error("You don't have permission for this action")

            const restaurantInfo = await ModelDb.RestaurantInfoModel.findOne({
                restaurant: restaurantId,
                isDeleted: false
            }).populate('restaurant').lean()
            if (!restaurantInfo.restaurant.isActive || restaurantInfo.restaurant.isDeleted) throw new Error("No booking found")

            const booking = await ModelDb.BookingModel.findOneAndUpdate(
                {
                    _id: id,
                    restaurant: restaurantId,
                    isFinished: false,
                    isDeleted: false
                },
                {
                    $set: {
                        ...req.body,
                        restaurant: restaurantId,
                    }
                },
                { new: true }
            )

            if (!booking) throw new Error("Booking not found")

            const message = "Update booking success"
            dataResponse(res, 200, message, bookingResponse(booking))

        } catch (error) {
            returnError(res, 403, error)
        }
    },
    updateBookingStatus: async (req, res) => {
        try {
            const { id } = req.params
            const { restaurantId } = req.body
            const user = req.user

            const employee = await ModelDb.EmployeeModel.findOne({
                restaurant: restaurantId,
                isDeleted: false,
                _id: user.userId
            }).lean()
            if (!employee) throw new Error("You don't have permission for this action")

            const booking = await ModelDb.BookingModel.findOne({
                _id: id,
                restaurant: restaurantId,
                isDeleted: false
            }).populate('restaurant')
            if (!booking) throw new Error("Booking not found")
            booking.depopulate()

            const currentDate = date(new Date())
            const checkinTimeBooking = date(booking.checkinTime)

            if (!booking.isCanceled) {
                if (currentDate.month !== checkinTimeBooking.month) throw new Error("The current month is not avalaible for this booking")
                if (currentDate.dateTime !== checkinTimeBooking.dateTime) throw new Error("The current date is not avalaible for this booking")
                if (currentDate.hour < checkinTimeBooking.hour) throw new Error("The current hour is not avalaible for this booking")
                if (currentDate.minutes < checkinTimeBooking.minutes) throw new Error("The current minute is not avalaible for this booking")
                if (currentDate.second < checkinTimeBooking.second) throw new Error("The current second is not avalaible for this booking")
                console.log(req.path)
                const status = req.path.split('/')[1]
                console.log(status)

                if (status === "checkin" && !booking.isCheckin) {
                    booking.isCheckin = true
                }
                else if (status === "finish" && booking.isCheckin && !booking.isFinished) {
                    booking.isFinished = true
                }
                else if (status === "cancel" && !booking.isCheckin && !booking.isFinished) {
                    booking.isCanceled = true
                } else throw new Error("Invalid status")

                await booking.save()

                const message = `Update bookign status successfully (${status})`
                dataResponse(res, 200, message, bookingResponse(booking))
            }
            else throw new Error("Invalid status or booking is already cancelled")
        } catch (error) {
            returnError(res, 403, error)
        }
    }
}

export default bookingController