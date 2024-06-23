const returnRestaurant = (data) => {
    const dto = data.toObject()
    return {
        _id: dto._id,
        name: dto.name,
        address: dto.address,
        avatar: dto.avatar,
        category: dto.category,
        minPrice: dto.minPrice,
        maxPrice: dto.maxPrice,
        rating: dto.rating,
        tableList: dto.tableList,
        isOpening: dto.isOpening,
        isActive: dto.isActive,
        isVerified: dto.isVerified,
        numberOfTablesBookedInLastWeek: dto.numberOfTablesBookedInLastWeek
    }
}

export default returnRestaurant