const restaurantInfoDTO = (data, user) => {
    let dto = null
    if (data) {
        dto = data.toObject()
        delete dto.isDeleted
        if (user?.userId !== dto.restaurant.manager || !user) {
            delete dto.employee
            delete dto.restaurant.manager
            delete dto.restaurant.isDeleted
        }
    }
    return dto
}

export default restaurantInfoDTO