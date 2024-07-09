import dataResponse from "../dataResponse/data.response.js"
import menuResponse from "../dataResponse/menu.js"
import returnError from "../errors/error.js"
import ModelDb from "../models/model.js"
import cloudinaryUploader from "../utils/cloudinaryUploader.js"
import duplicateErr from "../errors/duplicate.js"
import getPublicId from "../utils/getPublicId.js"
import pageSplit from "../utils/pageSplit.util.js"
import baseFolder from "../configs/cloudinaryFolder.config.js"
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
            if (menu.type === "food") {
                if (menu.price < restaurant.minPrice || restaurant.minPrice === null) {
                    restaurant.minPrice = menu.price
                    await restaurant.save()
                }
                if (menu.price > restaurant.maxPrice) {
                    restaurant.maxPrice = menu.price
                    await restaurant.save()
                }
            }
            const message = "Create menu success"

            dataResponse(res, 200, message, menuResponse(menu))

        } catch (err) {
            console.log('create menu error: ', err.message)
            returnError(res, 403, err)
        }
    },

    getMenuByRestaurantId: async (req, res) => {
        try {
            const { id } = req.params
            const { name, page, pageSize } = req.query
            const restaurant = await ModelDb.RestaurantModel.findOne({
                _id: id,
                isDeleted: false
            })
            if (!restaurant) throw new Error("Restaurant not found")

            const filterModel = {
                restaurant: id,
                isDeleted: false,
            }
            if (name) {
                filterModel.name = { $regex: name, $options: 'i' }
            }
            const menus = pageSplit(ModelDb.MenuModel, filterModel, page, pageSize, {}, undefined)
            if (menus.data.length === 0) throw new Error("Menu not found")

            const message = "Get menus success"
            const data = menus.map(menu => menuResponse(menu))
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
            dataResponse(res, 200, message, menuResponse(menu.depopulate('restaurant')))

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
            const folder = `${baseFolder.MENU}/${id}/Image`
            const result = await cloudinaryUploader.upload(file, folder)

            if (!result) throw new Error("Upload image failed")

            menu.image = result.secure_url
            await menu.save()

            const message = "Upload image success"
            dataResponse(res, 200, message, menuResponse(menu))
        } catch (error) {
            returnError(res, 403, error)
        }
    },
    updateMenuById: async (req, res) => {
        try {
            const { id } = req.params
            const { restaurantId, price } = req.body
            const user = req.user

            const restaurant = await ModelDb.RestaurantModel.findOne({
                _id: restaurantId,
                manager: user.userId,
                isDeleted: false
            })
            if (!restaurant) throw new Error("Restaurant not found")

            const menu = await ModelDb.MenuModel.findById(id)
            if (!menu) throw new Error("Menu not found")

            if (menu.type === "food") {
                const menus = await ModelDb.MenuModel.find({
                    type: "food"
                }).sort({
                    price: 1
                }).lean()

                const otherMenus = menus.filter(item => item.name !== menu.name)

                if (price < restaurant.minPrice) {
                    restaurant.minPrice = price
                }
                if (price > restaurant.minPrice && price < restaurant.maxPrice && price > otherMenus[0].price) {
                    restaurant.minPrice = otherMenus[0].price
                }
                if (price > restaurant.maxPrice) {
                    restaurant.maxPrice = price
                }
                if (price < otherMenus[0].price) {
                    restaurant.minPrice = price
                }
                if (price > otherMenus[otherMenus.length - 1].price) {
                    restaurant.maxPrice = price
                }
                if (price < otherMenus[otherMenus.length - 1].price) {
                    restaurant.maxPrice = otherMenus[otherMenus.length - 1].price
                }
            }
            for (let key of Object.keys(req.body)) {
                menu[key] = req.body[key]
            }

            await menu.save()
            await restaurant.save()

            const message = "Update menu success"
            dataResponse(res, 200, message, menuResponse(menu))

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