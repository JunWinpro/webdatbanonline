import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import rootRouter from "./src/router/index.js";
import { v2 as cloudinary } from "cloudinary"
import connectDb from "./src/database/db.js";
import cron from "node-cron"
import autoDeleteBooking from "./src/cron/bookingChecker.js";
import multer from "multer"
import returnError from "./src/errors/error.js";
dotenv.config()
const app = express()
app.use(cors());

app.use(express.json())

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true,
})

connectDb()

app.use(rootRouter)
cron.schedule('0 0,15,30,45 * * * *', autoDeleteBooking)
app.use((err, _, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            err.message = "Too many files uploaded"
            returnError(res, 400, err)
        } else {
            returnError(res, 500, err)
        }
    } else {
        next(err);
    }
});

app.listen(process.env.PORT || 8000, () => {
    console.log(`App is running on ${process.env.PORT || 8000}`);
});