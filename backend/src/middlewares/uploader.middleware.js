import multer from "multer"

const diskStorage = multer.diskStorage('../../public')
const diskUploader = multer({ storage: diskStorage })

const memoryStorage = multer.memoryStorage()
const memoryUploader = multer({ storage: memoryStorage })

export { diskUploader, memoryUploader }