import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import rootRouter from "./src/router/index.js";
import { v2 as cloudinary } from "cloudinary"
import connectDb from "./src/database/db.js";
import cron from "node-cron"
import autoDeleteBooking from "./src/cron/bookingChecker.js";
import multerError from "./src/router/routes/multerError.route.js";
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
app.use(multerError);

app.listen(process.env.PORT || 8000, () => {
    console.log(`App is running on ${process.env.PORT || 8000}`);
});