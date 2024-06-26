const employeeDTO = (data) => {
    let dto = null;
    if (data) {
        dto = data.toObject()
        delete dto.password
        delete dto.isDeleted
    }
    return dto
}

export default employeeDTO