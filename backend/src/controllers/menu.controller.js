import ModelDb from "../models/model.js"
import mongoose from 'mongoose'
const menuController = {
    createMenu: async (req, res) => {
        try {
            const user = req.user
            const { id } = req.params

            const findRestaurant = await ModelDb.RestaurantModel.findById(id)
            if (!findRestaurant) throw new Error("Restaurant not found")

            const findMenu = await ModelDb.MenuModel.findOne({
                name: req.body.name,
                restaurant: new mongoose.Types.ObjectId(id),
                manager: user.userId
            })

            if (findMenu) throw new Error("Menu is already exist")

            const createMenu = await ModelDb.MenuModel.create({
                ...req.body,
                restaurant: new mongoose.Types.ObjectId(id),
                manager: new mongoose.Types.ObjectId(user.userId)
            })

            res.status(201).json({
                message: "Create menu success",
                success: true,
                data: createMenu
            })

        } catch (error) {
            console.log('create menu error: ', error.message)
            res.status(403).json({
                message: error.message,
                success: false,
                data: null,
                err: error
            })
        }
    },

    getMenus: async (req, res) => {
        try {

        } catch (error) {
            console.log('get menus error: ', error.message)
            res.status(403).json({
                message: error.message,
                success: false,
                data: null,
                err: error
            })
        }
    },

    getMenuById: async (req, res) => {
        try {
            const menu = await ModelDb.MenuModel.findById(req.params.id)
            if (!menu) throw new Error("Menu not found")
            res.status(200).json({
                message: "Get menu success",
                success: true,
                data: menu
            })
        } catch (error) {
            console.log('get menu error: ', error.message)
            res.status(403).json({
                message: error.message,
                success: false,
                data: null,
                err: error
            })
        }
    },

    getMenuByRestaurantId: async (req, res) => {
        try {
            const restaurantMenu = await ModelDb.MenuModel.find({
                restaurant: req.params.id
            })
            if (!restaurantMenu) throw new Error("Menu of the restaurant not found")

            res.status(200).json({
                message: "Get menu success",
                success: true,
                data: restaurantMenu
            })

        } catch (error) {
            console.log('get menu error: ', error.message)
            res.status(403).json({
                message: error.message,
                success: false,
                data: null,
                err: error
            })
        }
    },

    updateMenuById: async (req, res) => {
        try {
            const menu = await ModelDb.MenuModel.findById(req.params.id)
            if (!menu) throw new Error("Menu not found")
            const updateMenu = await ModelDb.MenuModel.findByIdAndUpdate(req.params.id, req.body)
            res.status(200).json({
                message: "Update menu success",
                success: true,
                data: updateMenu
            })
        } catch (error) {

        }
    },

    deleteMenuById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user
            const restaurantId = req.body

            const findMenu = await ModelDb.MenuModel.find({
                _id: id,
                isDeleted: false,
                manager: new mongoose.Types.ObjectId(user.userId),
                restaurant: new mongoose.Types.ObjectId(restaurantId)
            })

            if (!findMenu) throw new Error("Menu not found")
        } catch (error) {
            console.log('delete menu error: ', error.message)
            res.status(403).json({
                message: error.message,
                success: false,
                data: null,
                err: error
            })
        }
    }
}

export default menuController