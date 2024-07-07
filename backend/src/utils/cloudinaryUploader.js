import { v2 as cloudinary } from 'cloudinary'
const cloudinaryUploader = {
    upload: async (file, folder) => {
        const fileName = `${Date.now()}-${file.originalname.replace(" ", "-").split('.')[0]}`
        const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
        const result = await cloudinary.uploader.upload(dataUrl, {
            resource_type: 'auto',
            folder,
            public_id: fileName
        })
        return result
    },
    destroy: async (publicId) => {
        const destroyResult = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image'
        })
        return destroyResult
    }
}
export default cloudinaryUploader