const userDTO = (data) => {
    let dto = null;
    if (data) {
        dto = data.toObject()
        delete dto.password
        delete dto.isDeleted
        delete dto.resetPasswordToken
        delete dto.resetPasswordExpireIn
        delete dto.veryficationToken
    }
    return dto
}

export default userDTO