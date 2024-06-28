import { v2 as cloudinary } from 'cloudinary'
const cloudinaryUploader = async (file, folder) => {
    const fileName = `${Date.now()}-${file.originalname.replace(" ", "-").split('.')[0]}`
    const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
    const result = await cloudinary.uploader.upload(dataUrl, {
        resource_type: 'auto',
        folder,
        public_id: fileName
    })
    return result
}
export default cloudinaryUploader