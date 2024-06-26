const returnRestaurant = (res, status, message, data, user) => {
    let dto = null
    if (data) {
        dto = data.toObject()
        if (user.userId !== data.manager.toString()) {
            delete dto.manager
        }
    }
    delete dto.isDeleted
    return res.status(status).json({
        success: true,
        data: dto,
        message,
    })
}

export default returnRestaurant