import mongoose from "mongoose";
const connectDb = async () => {
    await mongoose.connect()
}

export default connectDb;