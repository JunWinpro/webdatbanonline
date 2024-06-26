const pageSplit = async (model, filterModel, page, pageSize, sortModel, populated) => {

    const totalItems = await model.countDocuments(filterModel)
    const totalPages = Math.ceil(totalItems / (pageSize || 16))
    const skip = page > 1 ? (page - 1) * pageSize : 0

    const data = {
        totalPages,
        totalItems,
        data: null,
        page: page || 1
    }

    if (!populated) {
        const result = await model.find(filterModel).sort(sortModel).skip(skip).limit(pageSize || 16)
        data.data = result
    }
    else {
        const result = await model.find(filterModel).sort(sortModel).skip(skip).limit(pageSize || 16).populate(populated)
        data.data = result
    }
    return data
}

export default pageSplit