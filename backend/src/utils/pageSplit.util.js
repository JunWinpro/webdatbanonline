const pageSplit = async (page, pageSize, model, filterModel, populated, sortBy) => {
    let sortType = {}
    let totalItems;
    if (sortBy) {
        if (sortBy === "latest") {
            sortType.createdAt = -1
        } else if (sortBy === "oldest") {
            sortType.createdAt = 1
        } else if (sortBy === "lowest") {
            sortType.finalPrice = 1
        }
        else if (sortBy = "highest") {
            sortType.finalPrice = -1
        }
    }
    if (filterModel) {
        totalItems = await model.countDocuments(filterModel)
    } else {
        totalItems = await model.countDocuments()
    }
    const totalPages = Math.ceil(totalItems / Number(pageSize || 4))
    const skip = page ? (Number(page) - 1) * Number(pageSize || 4) : 0
    if (!populated) {
        const result = await model.find(filterModel && filterModel).sort(sortBy && sortType).skip(skip).limit(Number(pageSize || 4))
        const data = {
            totalPages,
            totalItems,
            data: result,
            page: Number(page) || 1
        }
        return data
    }
    else {
        const result = await model.find(filterModel).skip(skip).limit(Number(pageSize || 4)).populate(populated)
        const data = {
            totalPages,
            totalItems,
            data: result,
            page: Number(page) || 1
        }
        return data
    }

}
export default pageSplit