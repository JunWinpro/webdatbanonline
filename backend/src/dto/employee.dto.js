const returnEmployee = (data) => {
    const dto = data.toObject()
    return {
        _id: dto._id,
        manager: dto.manager,
        username: dto.username,
        phone: dto.phone,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender,
        employeeId: dto.employeeId,
        role: dto.role,
    }
}

export default returnEmployee