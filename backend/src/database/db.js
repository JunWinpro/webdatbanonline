import mongoose from "mongoose";
const connectDb = async () => {
    try {
        return await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_USERNAME}.skszduc.mongodb.net/${process.env.DB_COLLECTION_NAME}?retryWrites=true&w=majority&appName=${process.env.DB_APPNAME}`)
    } catch (error) {
        console.log(error)
    }
}

export default connectDb;