import cron from "node-cron"
import ModelDb from "../models/model.js"

const autoDeleteBooking = async () => {
    const date = new Date()
    const delayCheckinTime = date - 30 * 60 * 1000
    await ModelDb.BookingModel.updateMany(
        {
            checkinTime: delayCheckinTime,
            isCheckin: false,
            isFinished: false,
            isDeleted: false
        },
        {
            $set: {
                isDeleted: true
            }
        }
    )
}
export default autoDeleteBooking
