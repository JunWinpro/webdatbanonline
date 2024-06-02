import mongoose from "mongoose";
const connectDb = async () => {
    return await mongoose.connect("mongodb+srv://compassUser:compassUser@cluster0.3ckpb3m.mongodb.net/testRes")
}

export default connectDb;