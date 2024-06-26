import baseFolder from "../configs/cloudinaryFolder.config.js"
import ModelDb from "../models/model.js"
import { v2 as cloudinary } from 'cloudinary'
import mongoose from "mongoose"
import pageSplit from "../utils/pageSplit.util.js"
import lowerCaseString from "../utils/lowerCaseString.js"
import sortModelType from "../utils/sortModel.js"
import returnRestaurantFullInfo from "../dto/restaurantFullInfo.dto.js"
import returnRestaurant from "../dto/restaurant.dto.js"
import returnError from "../errors/error.js"
const restaurantController = {
    createRestaurant: async (req, res) => {
        try {
            const { name } = req.body
            const user = req.user

            const restaurantExist = await ModelDb.RestaurantModel.findOne({
                name
            })

            if (restaurantExist) throw new Error("Restaurant name already exist")

            const files = req.files

            const imageUrls = {}
            let i = 0;
            // restaurantImages, menuImages, foodImages, avatar
            while (Object.keys(files)[i]) {

                let listUrl = []
                let key = Object.keys(files)[i]

                for (let file of files[key]) {

                    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
                    const fileName = `${Date.now()}-${file.originalname.replace(" ", "-").split('.')[0]}`
                    const folder = key

                    const result = await cloudinary.uploader.upload(dataUrl, {
                        public_id: fileName,
                        resource_type: "auto",
                        folder: `${baseFolder.RESTAURANT}/${folder}/${name.replace(" ", "-")}`
                    })
                    if (!result) throw new Error("Error uploading file in: " + key)
                    listUrl.push(result.secure_url)
                    imageUrls[key] = listUrl
                }
                i++;
            }
            const newRestaurant = await ModelDb.RestaurantModel.create({
                ...req.body,
                manager: user.userId,
                avatar: imageUrls.avatar ? imageUrls.avatar[0] : null
            })

            const newRestaurantInfo = await ModelDb.RestaurantInfoModel.create({
                ...req.body,
                restaurant: newRestaurant._id,
                restaurantImages: imageUrls.restaurantImages || null,
                menuImages: imageUrls.menuImages || null,
                foodImages: imageUrls.foodImages || null
            })

            returnRestaurantFullInfo(res, 200, newRestaurantInfo, user)
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

            const filterModel = {
                isDeleted: false,
                isVerified: true
            }
            if (city) {
                filterModel['address.city'] = {
                    $regex: lowerCaseString(trimString(city)),
                    $options: "i"
                }
            }
            if (district) {
                filterModel['address.district'] = {
                    $regex: lowerCaseString(trimString(district)),
                    $options: "i"
                }
            }

            if (name) {
                filterModel.name = {
                    $regex: lowerCaseString(trimString(name)),
                    $options: 'i'
                }
            }

            if (category) {
                filterModel.category = {
                    $regex: lowerCaseString(category),
                    $options: 'i'
                }
            }

            const sortModel = {}
            if (sortBy) {
                const sortToObject = (ele) => {
                    if (ele.type === "rating") {
                        sortModel.rating = sortModelType(ele.value)
                    }
                    if (ele.type === "price") {
                        if (ele.value === "desc") {
                            sortModel.maxPrice = sortModelType(ele.value)
                        } else {
                            sortModel.minPrice = sortModelType(ele.value)
                        }
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

            const restaurants = await pageSplit(ModelDb.RestaurantModel, filterModel, page, pageSize, sortModel, undefined)

            res.status(200).json({
                message: "Get restaurants success",
                success: true,
                data: restaurants,
            })
        }
        catch (err) {
            console.log('get restaurant error: ', error.message)
            returnError(res, 403, err)
        }
    },

    getRestaurantById: async (req, res) => {
        try {
            const { id } = req.params
            const restaurant = await ModelDb.RestaurantInfoModel.findOne({
                restaurant: new mongoose.Types.ObjectId(id)
            }).populate('restaurant')

            if (!restaurant || restaurant.restaurant.isDeleted) throw new Error("Restaurant not found")

            const user = req.user

            res.status(200).json({
                message: "Get restaurant success",
                success: true,
                data: returnRestaurantFullInfo(restaurant, user),
            })
        }
        catch (err) {
            returnError(res, 403, err)
        }
    },

    updateRestaurantById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user

            let restaurant = await ModelDb.RestaurantModel.findOne({
                manager: new mongoose.Type.ObjectId(user.userId),
                isDeleted: false,
                _id: id
            })
            if (!restaurant) throw new Error("Restaurant not found")

            // tableList update 


            restaurant = {
                ...restaurant.toObject(),
                ...req.body
            }
            await restaurant.save()

            res.status(203).json({
                message: "Update restaurant success",
                success: true,
                data: returnRestaurant(restaurant),
            })
        } catch (err) {
            console.log("update restaurant err: ", err)
            returnError(res, 403, err)
        }
    },

    updateRestaurantInfoById: async (req, res) => {

    },
    updateRestaurantImage: async (req, res) => {

    },

    deleteRestaurantById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user

            const restaurant = await ModelDb.RestaurantModel.findOne({
                manager: new mongoose.Type.ObjectId(user.userId),
                isDeleted: false,
                _id: id,
            })
            if (!restaurant) throw new Error("Restaurant not found")

            restaurant.isDeleted = true

            await restaurant.save()

            res.status(203).json({
                message: "Delete restaurant success",
                success: true,
                data: restaurant,
            })
        } catch (err) {
            console.log("delete restaurant err: ", err)
            returnError(res, 403, err)
        }
    }
}
export default restaurantController
