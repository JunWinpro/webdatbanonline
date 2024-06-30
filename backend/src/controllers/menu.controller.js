import dataResponse from "../dto/data.js"
import menuDTO from "../dto/menu.dto.js"
import returnError from "../errors/error.js"
import ModelDb from "../models/model.js"
import cloudinaryUploader from "../utils/cloudinaryUploader.js"
import baseFolder from "../configs/cloudinaryFolder.config.js"
import duplicateErr from "../errors/duplicate.js"
import getPublicId from "../utils/getPublicId.js"
const menuController = {
    createMenu: async (req, res) => {
        try {
            const { restaurantId } = req.body
            const user = req.user

            const restaurant = await ModelDb.RestaurantModel.findOne({
                _id: restaurantId,
                manager: user.userId,
                isDeleted: false,
            })
            if (!restaurant) throw new Error("Restaurant not found")

            const menuExist = await ModelDb.MenuModel.findOne({
                name: req.body.name,
                restaurant: restaurantId
            })
            if (menuExist) throw new Error("Menu already exist")

            const latestMenu = await ModelDb.MenuModel.findOne({
                restaurant: restaurantId,
                isDeleted: false
            }).sort({ code: -1 })

            let code = null
            if (latestMenu) {
                code = Number(latestMenu.code.suffix).toString().padStart(3, '0')
            }
            const menu = await ModelDb.MenuModel.create({
                ...req.body,
                restaurant: restaurantId,
                'code.suffix': code ? code : "001"
            })

            const message = "Create menu success"

            dataResponse(res, 200, message, menuDTO(menu))

        } catch (err) {
            console.log('create menu error: ', err.message)
            returnError(res, 403, err)
        }
    },

    getMenuByRestaurantId: async (req, res) => {
        try {
            const { id } = req.params
            const restaurant = await ModelDb.RestaurantModel.findOne({
                _id: id,
                isDeleted: false
            })
            if (!restaurant) throw new Error("Restaurant not found")

            const menus = await ModelDb.MenuModel.find({
                restaurant: id
            })
            if (!menus.length) throw new Error("Menus not found")

            const message = "Get menus success"
            const data = menus.map(menu => menuDTO(menu))
            dataResponse(res, 200, message, data)

        } catch (err) {
            console.log('get menus err: ', err.message)
            returnError(res, 403, err)
        }
    },

    getMenuById: async (req, res) => {
        try {
            const { id } = req.params
            const menu = await ModelDb.MenuModel.findById(id).populate('restaurant')
            if (!menu) throw new Error("Menu not found")
            if (menu.restaurant.isDeleted) throw new Error('Restaurant not found')

            const message = "Get menu success"
            dataResponse(res, 200, message, menuDTO(menu.depopulate('restaurant')))

        } catch (error) {
            console.log('get menu error: ', error.message)
            returnError(res, 403, error)
        }
    },
    uploadMenuImage: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user
            const { restaurantId } = req.body
            const menu = await ModelDb.MenuModel.findOne({
                _id: id,
                restaurant: restaurantId,
                isDeleted: false
            }).populate('restaurant')

            if (!menu) throw new Error("Menu not found")
            if (menu.restaurant.isDeleted) throw new Error('Restaurant not found')
            if (menu.restaurant.manager.toString() !== user.userId) throw new Error("You don't have permission for this action")

            if (menu.image) {
                const publicId = getPublicId(menu.image)
                const destroyResult = await cloudinaryUploader.destroy(publicId)
                if (destroyResult.result !== 'ok') throw new Error("Delete image failed")
            }

            const file = req.file
            const result = await cloudinaryUploader.upload(file)

            if (!result) throw new Error("Upload image failed")

            menu.image = result.secure_url
            await menu.save()

            const message = "Upload image success"
            dataResponse(res, 200, message, menuDTO(menu))
        } catch (error) {
            returnError(res, 403, error)
        }
    },
    updateMenuById: async (req, res) => {
        try {
            const { id } = req.params
            const { restaurantId } = req.body
            const user = req.user

            const restaurant = await ModelDb.RestaurantModel.findOne({
                _id: restaurantId,
                manager: user.userId,
                isDeleted: false
            })
            if (!restaurant) throw new Error("Restaurant not found")

            const menu = await ModelDb.MenuModel.findById(id)
            if (!menu) throw new Error("Menu not found")

            if (req.body.name) {
                const menuExist = await ModelDb.MenuModel.findOne({
                    name: req.body.name,
                    restaurant: restaurantId
                })
                if (menuExist) throw new Error("Menu name already exist")
            }

            const file = req.file
            let image = null
            if (file) {
                const folder = `${baseFolder.RESTAURANT}/${restaurant.name.replace(" ", "-")}/Menu`
                const result = await cloudinaryUploader.upload(file, folder)
                if (!result) throw new Error("Upload failed")
                image = result.secure_url

                const publicId = getPublicId(menu.image)

                const destroyResult = await cloudinaryUploader.destroy(publicId)
                if (destroyResult.result !== 'ok') throw new Error("Delete image failed")
            }

            for (let key of Object.keys(req.body)) {
                menu[key] = req.body[key]
            }
            menu.image = image ? image : menu.image

            await menu.save()
            const message = "Update menu success"
            dataResponse(res, 200, message, menuDTO(menu))

        } catch (err) {
            console.log('update menu error: ', err.message)
            returnError(res, 403, duplicateErr(err))
        }
    },

    deleteMenuById: async (req, res) => {
        try {
            const { id } = req.params
            const user = req.user

            const menu = await ModelDb.MenuModel.findOne({
                _id: id,
            }).populate('restaurant')

            if (menu.restaurant.manager.toString() !== user.userId) throw new Error("You don't have permission for this action")
            if (!menu) throw new Error("Menu not found")
            if (menu.restaurant.isDeleted) throw new Error('Restaurant not found')

            menu.isDeleted = true
            await menu.save()

            const message = "Delete menu success"
            dataResponse(res, 200, message)

        } catch (error) {
            console.log('delete menu error: ', error.message)
            returnError(res, 403, error)
        }
    }
}

export default menuController