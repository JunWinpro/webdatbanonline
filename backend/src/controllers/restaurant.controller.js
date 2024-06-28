import baseFolder from "../configs/cloudinaryFolder.config.js"
import ModelDb from "../models/model.js"
import { v2 as cloudinary } from 'cloudinary'
import mongoose from "mongoose"
import pageSplit from "../utils/pageSplit.util.js"
import sortModelType from "../utils/sortModel.js"
import restaurantInfoDTO from "../dto/restaurantInfo.dto.js"
import returnError from "../errors/error.js"
import dataResponse from "../dto/data.js"
import restaurantDTO from "../dto/restaurant.dto.js"
import sendEmail from "../utils/sendEmail.js"
import cloudinaryUploader from "../utils/cloudinaryUploader.js"
const restaurantController = {
    createRestaurant: async (req, res) => {
        try {
            const { name, address } = req.body

            const restaurantExist = await ModelDb.RestaurantModel.findOne({
                name,
                'address.province': address.province,
                'address.district': address.district,
                'address.subDistrict': address.subDistrict,
                isDeleted: false
            })

            if (restaurantExist) throw new Error("Restaurant name already exist")

            const user = req.user

            const newRestaurant = await ModelDb.RestaurantModel.create({
                ...req.body,
                manager: user.userId,
                // avatar: imageUrls.avatar ? imageUrls.avatar[0] : null
            })

            const newRestaurantInfo = await ModelDb.RestaurantInfoModel.create({
                ...req.body,
                restaurant: newRestaurant._id,

            })

            const files = req.files

            const imageUrls = {}
            // restaurantImages, menuImages, foodImages, avatar
            if (files) {
                let i = 0;
                while (Object.keys(files)[i]) {

                    let listUrl = []
                    let key = Object.keys(files)[i]

                    for (let file of files[key]) {
                        const folder = `${baseFolder.RESTAURANT}/${name.replace(" ", "-")}/${key}`

                        const result = await cloudinaryUploader(file, folder)

                        if (!result) throw new Error("Error uploading file in: " + key)
                        listUrl.push(result.secure_url)
                        imageUrls[key] = listUrl
                    }
                    i++;
                }
            }
            newRestaurant.avatar = imageUrls.avatar ? imageUrls.avatar[0] : null
            await newRestaurant.save()

            newRestaurantInfo.restaurantImages = imageUrls.restaurantImages || null
            newRestaurantInfo.menuImages = imageUrls.menuImages || null
            newRestaurantInfo.foodImages = imageUrls.foodImages || null
            await newRestaurantInfo.save()

            const message = "Create restaurant success, please wait for admin approve"

            dataResponse(res, 201, message, {
                ...restaurantDTO(newRestaurant),
                ...restaurantInfoDTO(newRestaurantInfo, user)
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

            const dataDTO = restaurants.data.map(restaurant => restaurantDTO(restaurant))

            const message = "Get restaurants success"
            dataResponse(res, 200, message, dataDTO)
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

                const dataDTO = restaurants.data.map(restaurant => restaurantDTO(restaurant))

                const message = "Get restaurants success"
                dataResponse(res, 200, message, dataDTO)
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
            dataResponse(res, 200, message, restaurantInfoDTO(currentRestaurant), user)
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
                manager: new mongoose.Type.ObjectId(user.userId),
                isDeleted: false,
                _id: id
            })
            if (!restaurant) throw new Error("Restaurant not found")

            for (let key of Object.keys(req.body)) {
                restaurant[key] = req.body[key]
            }

            await restaurant.save()
            const message = "Update restaurant success"
            dataResponse(res, 200, message, restaurantDTO(restaurant))

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
                restaurant: new mongoose.Type.ObjectId(id),
                isDeleted: false
            }).populate('restaurant')
            if (!restaurantInfo) throw new Error("Restaurant not found")
            if (restaurantInfo.restaurant.manager !== user.userId) throw new Error("You don't have permission for this action")

            for (let key of Object.keys(req.body)) {
                restaurantInfo[key] = req.body[key]
            }
            await restaurantInfo.save()
            const message = "Update restaurant info success"
            const depopulate = mongoose.models.RestaurantInfoModel.depopulate(restaurantInfo)
            dataResponse(res, 200, message, restaurantInfoDTO(depopulate, user))
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },
    updateRestaurantImages: async (req, res) => {

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
            dataResponse(res, 200, message, restaurantDTO(restaurant))
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

            const message = "Active restaurant success"

            dataResponse(res, 200, message, restaurantDTO(restaurant))
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

            dataResponse(res, 200, message, restaurantDTO(restaurant))
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },
    deleteRestaurantById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user

            const restaurant = await ModelDb.RestaurantModel.findOne({
                manager: user.userId,
                isDeleted: false,
                _id: id,
            }).populate('manager')

            if (!restaurant) throw new Error("Restaurant not found")

            const restaurantInfo = await ModelDb.RestaurantInfoModel.findOne({
                restaurant: id,
                isDeleted: false,
            })

            restaurant.isDeleted = true
            restaurant.isActive = false

            restaurantInfo.isDeleted = true

            await restaurant.save()
            await restaurantInfo.save()

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


