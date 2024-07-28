import ModelDb from "../models/model.js"

const resetBookingRestaurant = async () => {
    try {
        const date = new Date()
        const dayOfWeek = date.getDay()
        if (dayOfWeek === 0) {
            await ModelDb.RestaurantModel.updateMany({
                isDeleted: false,
                isActive: true,
                isVerified: true,
            }, {
                $set: {
                    numberOfTablesBookedInLastWeek: 0
                }
            })
        }
        else return
    } catch (error) {
        console.log(`Error reset restaurants booking`);
    }
}

export default resetBookingRestaurant