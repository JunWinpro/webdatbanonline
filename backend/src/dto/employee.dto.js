const employeeDTO = (data) => {
    let dto = null
    if (data) {
        dto = data.toObject()
        console.log(dto)
        delete dto.password
        delete dto.isDeleted
    }
    console.log(dto)
    return dto
}

export default employeeDTO