const returnUser = (data) => {
    const dto = data.toObject()
    return {
        _id: dto._id,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        address: dto.address,
        phone: dto.phone,
        avatar: dto.avatar,
        role: dto.role,
        isVerified: dto.isVerified
    }
}

export default returnUser