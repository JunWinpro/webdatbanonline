const returnRestaurantFullInfo = (res, status, data, user) => {
    let dto = null
    if (data) {
        dto = data.toObject()
        if (user.userId !== data.manager.toString()) {
            delete dto.restaurant.manager
            delete dto.employee
        }
    }
    delete dto.isDeleted
    delete dto.restaurant.isDeleted
    return res.status(status).json({
        success: true,
        data: dto,
        message,
    })
}

export default returnRestaurantFullInfo