const restaurantDTO = (data) => {
    let dto = null
    if (data) {
        dto = data.toObject()
        delete dto.manager
        delete dto.isDeleted
    }
    return dto
}

export default restaurantDTO