import baseFolder from "../configs/cloudinaryFolder.config.js"
import ModelDb from "../models/model.js"
import { v2 as cloudinary } from 'cloudinary'
const restaurantController = {

    createRestaurant: async (req, res) => {
        try {
            const { name } = req.newBody
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
                avatar: imageUrls.avatar[0] || null
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
                data: null,
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
}

export default restaurantController