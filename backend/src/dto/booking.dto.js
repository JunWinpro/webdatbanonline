const bookingDTO = (data) => {
    let dto = null
    if (data) {
        dto = data.toObject()
        delete dto.isDeleted
    }
    return dto
}
export default bookingDTO