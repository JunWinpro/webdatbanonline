const returnEmployee = (res, status, message, data, token) => {
    let dto = null;
    if (data) {
        dto = data.toObject()
        delete dto.password
        delete dto.isDeleted
    }
    return res.status(status).json({
        data: dto,
        success: true,
        message,
        ...token
    })
}

export default returnEmployee