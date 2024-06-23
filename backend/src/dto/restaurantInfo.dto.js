const returnRestaurantInfo = (data) => {
    const dto = data.toObject()
    return {
        maxim: dto.maxim,
        description: dto.description,
        schedule: dto.schedule,
        foodImages: dto.foodImages,
        menuImages: dto.menuImages,
        restaurantImages: dto.restaurantImages,
    }
}

export default returnRestaurantInfo