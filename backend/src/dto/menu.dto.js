const menuDTO = (data) => {
    let dto = null
    if (data) {
        dto = data.toObject()
        delete dto.manager
    }
    return dto
}
export default menuDTO