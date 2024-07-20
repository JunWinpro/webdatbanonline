import returnError from "../errors/error.js"
import ModelDb from "../models/model.js"

const autoCancelBooking = async () => {
    try {
        const date = new Date()
        const currentTime = date.getTime()
        const filter = {
            checkinTime: {
                $lte: currentTime - 3 * 60 * 60 * 1000
            },
            isCheckin: false,
            isFinished: false,
            isDeleted: false,
            isCanceled: false
        }
        await ModelDb.BookingModel.updateMany(filter, {
            $set: {
                isCanceled: true
            }
        })
        console.log("cancel");
    }
    catch (err) {
        returnError(res, 403, err)
    }
}
export default autoCancelBooking
