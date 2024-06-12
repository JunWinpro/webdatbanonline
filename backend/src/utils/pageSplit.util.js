const pageSplit = async (model, filterModel, page, pageSize, sortModel, populated) => {
    let sortType = {}
    let totalItems;
    let currentPage = page ? Number(page) : 1
    let currentPageSize = pageSize ? Number(pageSize) : 12

    if (!Number.isInteger(currentPage) || currentPage <= 0) throw new Error("Invalid page")
    if (!Number.isInteger(currentPageSize) || currentPageSize <= 0) throw new Error("Invalid page size")

    totalItems = await model.countDocuments(filterModel)

    const totalPages = Math.ceil(totalItems / currentPageSize)
    const skip = currentPage > 1 ? (Number(page) - 1) * currentPageSize : 0
    let data = {
        totalPages,
        totalItems,
        data: null,
        page: currentPage
    }
    if (!populated) {
        const result = await model.find(filterModel && filterModel).sort(sortModel).skip(skip).limit(currentPageSize)
        data.data = result
    }
    else {
        const result = await model.find(filterModel).skip(skip).limit(currentPageSize).populate(populated)
        data.data = result
    }
    return data
}

export default pageSplit