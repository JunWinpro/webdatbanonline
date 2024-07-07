import baseFolder from "../configs/cloudinaryFolder.config.js"
import ModelDb from "../models/model.js"
import mongoose from "mongoose"
import pageSplit from "../utils/pageSplit.util.js"
import sortModelType from "../utils/sortModel.js"
import restaurantInfoResponse from "../dataResponse/restaurantInfo.js"
import returnError from "../errors/error.js"
import dataResponse from "../dataResponse/data.response.js"
import restaurantResponse from "../dataResponse/restaurant.js"
import sendEmail from "../utils/sendEmail.js"
import cloudinaryUploader from "../utils/cloudinaryUploader.js"
import getPublicId from "../utils/getPublicId.js"
import trimString from "../utils/trimString.js"
const restaurantController = {
    createRestaurant: async (req, res) => {
        try {
            const { name } = req.body

            const restaurantExist = await ModelDb.RestaurantModel.findOne({
                name,
                isDeleted: false
            })

            if (restaurantExist) throw new Error("Restaurant name already exist")

            const user = req.user

            const newRestaurant = await ModelDb.RestaurantModel.create({
                ...req.body,
                manager: user.userId,
            })

            const newRestaurantInfo = await ModelDb.RestaurantInfoModel.create({
                ...req.body,
                restaurant: newRestaurant._id,

            })

            const message = "Create restaurant success, please wait for admin approve"

            dataResponse(res, 201, message, {
                ...restaurantResponse(newRestaurant),
                ...restaurantInfoResponse(newRestaurantInfo, user)
            })
        }
        catch (err) {
            console.log("create restaurant err: ", err)
            returnError(res, 403, err)
        }
    },

    getRestaurants: async (req, res) => {
        try {
            let { name, sortBy, page, pageSize, city, district, category } = req.query

            if (district && !city) throw new Error("Please choose city first")

            const sortModel = {}
            if (sortBy) {
                const sortToObject = (ele) => {
                    if (ele.type === "rating") {
                        sortModel.rating = sortModelType(ele.value)
                    }
                    if (ele.type === "price") {
                        sortModel.minPrice = sortModelType(ele.value)
                    }
                    if (ele.type === "new") {
                        sortModel.createdAt = sortModelType(ele.value)
                    }
                    if (ele.type === "name") {
                        sortModel.name = sortModelType(ele.value)
                    }
                }
                if (Array.isArray(sortBy)) {
                    const sortMap = sortBy.map(ele => {
                        const [type, value] = ele.split("_")
                        return { type, value }
                    })

                    sortMap.forEach(ele => {
                        sortToObject(ele)
                    })
                }
                else {
                    const [type, value] = sortBy.split("_")
                    sortToObject({ type, value })
                }
            }

            const filterModel = {
                isDeleted: false,
            }

            if (city) {
                filterModel['address.city'] = {
                    $regex: city,
                    $options: "i"
                }
            }

            if (district) {
                filterModel['address.district'] = {
                    $regex: district,
                    $options: "i"
                }
            }

            if (name) {
                filterModel.name = {
                    $regex: name,
                    $options: 'i'
                }
            }

            if (category) {
                filterModel.category = {
                    $regex: category,
                    $options: 'i'
                }
            }

            const restaurants = await pageSplit(ModelDb.RestaurantModel, filterModel, page, pageSize, sortModel)

            const data = {
                data: restaurants.data.map(restaurant => restaurantResponse(restaurant)),
                totalPages: restaurants.totalPages,
                page: restaurants.page,
                totalItems: restaurants.totalItems
            }

            const message = "Get restaurants success"
            dataResponse(res, 200, message, data)
        }
        catch (err) {
            console.log('get restaurant error: ', err.message)
            returnError(res, 403, err)
        }
    },
    getOwnedRestaurants: async (req, res) => {
        {
            try {
                let { name, sortBy, page, pageSize, city, district, category } = req.query

                if (district && !city) throw new Error("Please choose city first")

                const sortModel = {}
                if (sortBy) {
                    const sortToObject = (ele) => {
                        if (ele.type === "rating") {
                            sortModel.rating = sortModelType(ele.value)
                        }
                        if (ele.type === "price") {
                            sortModel.minPrice = sortModelType(ele.value)
                        }
                        if (ele.type === "new") {
                            sortModel.createdAt = sortModelType(ele.value)
                        }
                        if (ele.type === "name") {
                            sortModel.name = sortModelType(ele.value)
                        }
                    }
                    if (Array.isArray(sortBy)) {
                        const sortMap = sortBy.map(ele => {
                            const [type, value] = ele.split("_")
                            return { type, value }
                        })

                        sortMap.forEach(ele => {
                            sortToObject(ele)
                        })
                    }
                    else {
                        const [type, value] = sortBy.split("_")
                        sortToObject({ type, value })
                    }
                }

                const user = req.user

                const filterModel = {
                    isDeleted: false,
                }

                filterModel['manager'] = user.userId

                if (city) {
                    filterModel['address.city'] = {
                        $regex: city,
                        $options: "i"
                    }
                }

                if (district) {
                    filterModel['address.district'] = {
                        $regex: district,
                        $options: "i"
                    }
                }

                if (name) {
                    filterModel.name = {
                        $regex: name,
                        $options: 'i'
                    }
                }

                if (category) {
                    filterModel.category = {
                        $regex: category,
                        $options: 'i'
                    }
                }

                const restaurants = await pageSplit(ModelDb.RestaurantModel, filterModel, page, pageSize, sortModel)
                if (restaurants.data.length === 0) throw new Error("Restaurant not found")
                const data = {
                    data: restaurants.data.map(restaurant => restaurantResponse(restaurant)),
                    totalPages: restaurants.totalPages,
                    page: restaurants.page,
                    totalItems: restaurants.totalItems
                }

                const message = "Get restaurants success"
                dataResponse(res, 200, message, data)
            }
            catch (err) {
                console.log('get restaurant error: ', err.message)
                returnError(res, 403, err)
            }
        }
    },
    getRestaurantById: async (req, res) => {
        try {
            const { id } = req.params
            const currentRestaurant = await ModelDb.RestaurantInfoModel.findOne({
                restaurant: id
            }).populate('restaurant')

            if (!currentRestaurant || currentRestaurant.restaurant.isDeleted) throw new Error("Restaurant not found")

            const user = req.user

            const message = "Get restaurant success"
            dataResponse(res, 200, message, restaurantInfoResponse(currentRestaurant), user)
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },

    updateRestaurantById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user

            const restaurant = await ModelDb.RestaurantModel.findOne({
                manager: user.userId,
                isDeleted: false,
                _id: id
            })
            if (!restaurant) throw new Error("Restaurant not found")

            for (let key of Object.keys(req.body)) {
                restaurant[key] = req.body[key]
            }

            await restaurant.save()
            const message = "Update restaurant success"
            dataResponse(res, 200, message, restaurantResponse(restaurant))

        } catch (err) {
            console.log("update restaurant err: ", err)
            returnError(res, 403, err)
        }
    },

    updateRestaurantInfoById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user

            const restaurantInfo = await ModelDb.RestaurantInfoModel.findOne({
                restaurant: id,
                isDeleted: false
            }).populate('restaurant')

            if (!restaurantInfo) throw new Error("Restaurant not found")
            if (restaurantInfo.restaurant.manager.toString() !== user.userId) throw new Error("You don't have permission for this action")
            restaurantInfo.depopulate()
            for (let key of Object.keys(req.body)) {
                restaurantInfo[key] = req.body[key]
            }
            await restaurantInfo.save()
            const message = "Update restaurant info success"

            dataResponse(res, 200, message, restaurantInfoResponse(restaurantInfo, user))
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },
    uploadRestaurantAvatar: async (req, res) => {
        try {
            const { id } = req.params

            const user = req.user
            const restaurant = await ModelDb.RestaurantModel.findOne({
                _id: id,
                manager: user.userId,
                isDeleted: false
            })

            if (!restaurant) throw new Error("Restaurant not found")

            if (restaurant.avatar) {
                const publicId = getPublicId(restaurant.avatar)
                const destroyResult = await cloudinaryUploader.destroy(publicId)
                if (destroyResult.result !== 'ok') throw new Error("Delete image failed")
            }

            const file = req.file

            const folder = `${baseFolder.RESTAURANT}/${id}/Avatar`
            const result = await cloudinaryUploader.upload(file, folder)

            if (!result) throw new Error("Upload failed")

            restaurant.avatar = result.secure_url

            await restaurant.save()

            const message = "Upload success"

            dataResponse(res, 200, message, restaurantResponse(restaurant))

        } catch (err) {
            returnError(res, 403, err)
        }
    },
    uploadRestaurantImages: async (req, res) => {
        try {
            const { id } = req.params

            const user = req.user
            const currentRestaurant = await ModelDb.RestaurantInfoModel.findOne({
                restaurant: id,
                isDeleted: false
            }).populate('restaurant')

            if (!currentRestaurant) throw new Error("Restaurant not found")
            if (currentRestaurant.restaurant.manager.toString() !== user.userId) throw new Error("You don't have permission for this action")
            if (currentRestaurant.restaurant.isDeleted) throw new Error("Restaurant not found")

            let field = null
            const keyword = req.path.split('/')[2].split('-')[0]
            switch (keyword) {
                case 'food':
                    field = 'foodImages'
                    break;
                case 'menu':
                    field = 'menuImages'
                    break;
                case 'restaurant':
                    field = 'restaurantImages'
                    break;
                default:
                    break;
            }
            if (!req.body[field] && req.files.length === 0) throw new Error("Please select image(s) to upload or delete")
            if (req.body[field]) {

                if (req.body[field].length === 0) throw new Error("Please select image to delete")

                for (let item of req.body[field]) {
                    if (!item || typeof (item) !== 'string') throw new Error("Invalid image url")
                    if (trimString(item).length === 0) throw new Error("Invalid image url")

                    const publicId = getPublicId(item)

                    if (!publicId) throw new Error("Invalid image url")
                    const destroyResult = await cloudinaryUploader.destroy(publicId)

                    if (destroyResult.result === "not found") throw new Error("Delete image failed: Image not found")
                    if (destroyResult.result !== 'ok') throw new Error("Delete image failed: Server error")
                }
                currentRestaurant[field] = currentRestaurant[field].filter(image => !req.body[field].includes(image))

            }
            if (req.files.length > 0) {
                const files = req.files
                const folder = `${baseFolder.RESTAURANT}/${id}/${field}`
                for (let file of files) {
                    const result = await cloudinaryUploader.upload(file, folder)

                    if (!result.secure_url) throw new Error("Upload failed")

                    currentRestaurant[field].push(result.secure_url)
                }
            }
            await currentRestaurant.save()
            const message = "Upload success"
            dataResponse(res, 200, message, restaurantResponse(currentRestaurant.depopulate('restaurant')))

        } catch (err) {
            returnError(res, 500, err)
        }
    },

    approveRestaurantById: async (req, res) => {
        try {
            const { id } = req.params
            const restaurant = await ModelDb.RestaurantModel.findOne({
                _id: id,
                isDeleted: false,
                isVerified: false
            }).populate('manager')
            if (!restaurant) throw new Error("Restaurant not found")
            restaurant.isVerified = true
            await restaurant.save()
            const info = {
                subject: `Restaurant Approved`,
                textOption: `Your restaurant ${restaurant.name} has been approved successfully.`,
            }
            await sendEmail(restaurant.manager.email, undefined, info)
            const message = "Approve restaurant success"
            dataResponse(res, 200, message, restaurantResponse(restaurant))
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },
    openRestaurantById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user
            const restaurant = await ModelDb.RestaurantModel.findOneAndUpdate({
                manager: user.userId,
                _id: id,
                isDeleted: false,
                isOpening: false,
                isVerified: true,
                isActive: true
            }, {
                $set: {
                    isOpening: true
                }
            })
            if (!restaurant) throw new Error("Restaurant not found")
            dataResponse(res, 200, "Restaurant is opening now", restaurantResponse(restaurant))
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },
    closeRestaurantById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user
            const restaurant = await ModelDb.RestaurantModel.findOneAndUpdate({
                manager: user.userId,
                _id: id,
                isDeleted: false,
                isOpening: true,
                isVerified: true,
                isActive: true
            }, {
                $set: {
                    isOpening: false
                }
            })
            if (!restaurant) throw new Error("Restaurant not found")
            dataResponse(res, 200, "Restaurant is closing now", restaurantResponse(restaurant))
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },
    activeRestaurantById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user
            const restaurant = await ModelDb.RestaurantModel.findOne({
                _id: id,
                manager: user.userId,
                isDeleted: false,
                isVerified: true,
                isActive: false
            }).populate('manager')
            if (!restaurant) throw new Error("Restaurant not found")

            restaurant.isActive = true
            await restaurant.save()
            const info = {
                subject: `Restaurant Activated`,
                textOption: `Your restaurant ${restaurant.name} has been activated successfully.`,
            }

            await sendEmail(restaurant.manager.email, undefined, info)
            restaurant.depopulate()
            const message = "Active restaurant success"

            dataResponse(res, 200, message, restaurantResponse(restaurant))
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },
    deactiveRestaurantById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user
            const restaurant = await ModelDb.RestaurantModel.findOne({
                _id: id,
                manager: user.userId,
                isDeleted: false,
                isVerified: true,
                isActive: true
            }).populate('manager')
            if (!restaurant) throw new Error("Restaurant not found")

            restaurant.isActive = false

            await restaurant.save()

            const info = {
                subject: `Restaurant Deactivated`,
                textOption: `Your restaurant ${restaurant.name} has been deactivated successfully.`,
            }

            await sendEmail(restaurant.manager.email, undefined, info)

            const message = "Deactive restaurant success"

            dataResponse(res, 200, message, restaurantResponse(restaurant))
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },
    deleteRestaurantById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user

            const restaurant = await ModelDb.RestaurantModel.updateOne({
                manager: user.userId,
                isDeleted: false,
                _id: id,
            },
                {
                    $set: {
                        isDeleted: true,
                    }
                }
            )

            if (!restaurant) throw new Error("Restaurant not found")

            const restaurantInfo = await ModelDb.RestaurantInfoModel.updateOne({
                restaurant: id,
                isDeleted: false,
            },
                {
                    $set: {
                        isDeleted: true,
                    }
                }
            )
            await ModelDb.MenuModel.updateMany(
                { restaurant: id },
                { $set: { isDeleted: true } }
            )
            await ModelDb.BookingModel.updateMany(
                { restaurant: id },
                { $set: { isDeleted: true } }
            )
            await ModelDb.ReviewModel.updateMany(
                { restaurant: id },
                { $set: { isDeleted: true } }
            )
            await ModelDb.BillModel.updateMany(
                { restaurant: id },
                { $set: { isDeleted: true } }
            )
            const info = {
                subject: `Restaurant Deleted`,
                textOption: `Your restaurant has been deleted successfully by ${user.role === 'admin' ? `Admin ${user.email}` : 'you'}, if you have any questions, please contact us.`,
            }

            await sendEmail(restaurant.manager.email, undefined, info)

            const message = "Delete restaurant success"
            dataResponse(res, 200, message)

        } catch (err) {

            console.log("delete restaurant err: ", err)
            returnError(res, 403, err)
        }
    }
}
export default restaurantController


