import baseFolder from "../configs/cloudinaryFolder.config.js"
import ModelDb from "../models/model.js"
import { v2 as cloudinary } from 'cloudinary'
import mongoose from "mongoose"
import pageSplit from "../utils/pageSplit.util.js"
import lowerCaseString from "../utils/lowerCaseString.js"
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
            // const { restaurantImages, menuImages, foodImages,avatar } = files

            const imageUrls = {}
            let i = 0;

            while (Object.keys(files)[i]) {

                let listUrl = []
                let key = Object.keys(files)[i]

                for (let file of files[key]) {

                    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
                    console.log(file)
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

            res.status(201).json({
                message: "Create restaurant success",
                success: true,
                data: {
                    restaurant: newRestaurant,
                    restaurantInfo: newRestaurantInfo,
                },
            })
        }
        catch (err) {
            console.log("create restaurant err: ", err)
            res.status(403).json({
                message: err.message,
                success: false,
                data: null,
                err
            })
        }
    },

    getRestaurants: async (req, res) => {
        try {
            let { name, sortBy, page, pageSize, city, district, category } = req.query

            if (district && !city) throw new Error("Please choose city first")


            let filterLocation = {}
            if (city) {
                filterLocation = {
                    ...filterLocation,
                    'address.city': {
                        $regex: lowerCaseString(city),
                        $options: "i"
                    }
                }
            }
            if (district) {
                filterLocation = {
                    ...filterLocation,
                    'address.district': {
                        $regex: lowerCaseString(district),
                        $options: "i"
                    }
                }
            }

            let filterName = {}
            if (name) {
                filterName.name = {
                    $regex: new RegExp('^' + name.normalize('NFD').replace(/[\u0300-\u036f]/g, function (c) {
                        return c.charCodeAt(0).toString(16);
                    }).replace(/[^a-zA-Z0-9]/g, ''), 'i')
                }
            }

            const filterModel = {
                ...filterLocation,
                ...filterName
            }

            const restaurants = await ModelDb.RestaurantModel.find(
                {
                    name: {
                        $regex: 'nhà',
                        $options: "i"
                    }
                }
            )

            if (restaurants.length === 0) throw new Error("No restaurant found")

            res.status(200).json({
                message: "Get restaurants success",
                success: true,
                data: restaurants,
            })
        }
        catch (error) {
            console.log('get restaurant error: ', error.message)
            res.status(403).json({
                message: error.message,
                success: false,
                data: null,
                err: error,
            })
        }
    },

    getRestaurantById: async (req, res) => {
        try {
            const { id } = req.params

            let returnRestaurant;

            if (req.originalUrl.includes('full-info')) {

                const restaurant = await ModelDb.RestaurantInfoModel.findOne({
                    restaurant: new mongoose.Types.ObjectId(id)
                }).populate('restaurant')

                if (restaurant.restaurant.isDeleted) throw new Error("Restaurant not found")

                returnRestaurant = restaurant.toObject()

                delete returnRestaurant.restaurant.manager
                delete returnRestaurant.restaurant.employee

            } else {
                const restaurant = await ModelDb.RestaurantModel.findOne({
                    _id: new mongoose.Types.ObjectId(id),
                    isDeleted: false
                })

                if (!restaurant) throw new Error("Restaurant not found")

                returnRestaurant = restaurant.toObject()

                delete returnRestaurant.manager
                delete returnRestaurant.employee
            }

            res.status(200).json({
                message: "Get restaurant success",
                success: true,
                data: returnRestaurant,
            })
        }
        catch (err) {
            res.status(403).json({
                message: err.message,
                success: false,
                data: null,
                err
            })
        }
    },

    updateRestaurantById: async (req, res) => {
        try {
            const { id } = req.params

            const restaurant = await ModelDb.RestaurantModel.findOne({

            })
            if (!restaurant) throw new Error("")


        } catch (error) {

        }
    }

}
export default restaurantController
