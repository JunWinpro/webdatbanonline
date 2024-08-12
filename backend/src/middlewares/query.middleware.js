import unidecode from "unidecode"
import returnError from "../errors/error.js"
import trimString from "../utils/trimString.js"
import districts from "../jsonDb/districts.json" with {type: "json"}
import cities from "../jsonDb/cities.json" with {type: "json"}
const queryMiddleWare = {
    restaurant: (req, res, next) => {
        try {

            const filterModel = {}
            const acceptQuery = ['sort', 'name', 'minPrice', 'maxPrice', 'rating', 'category', 'isOpening', 'city', 'district']
            for (let key of Object.keys(req.query)) {
                if (!acceptQuery.includes(key)) {
                    throw new Error(`Invalid query parameter: ${key}`)
                }
                if (key === 'sort') {
                    const [sortKey, sortValue] = req.query[key].split('_')
                    if (Number(sortValue) !== 1 && Number(sortValue) !== -1) {
                        throw new Error("Invalid sort value")
                    }
                    const newSort = {
                        [sortKey]: Number(sortValue)
                    }
                    req.query.sortModel = newSort
                }
                if (key === 'name') {
                    if (trimString(req.query[key]).length === 0) {
                        throw new Error("Name query cannot be empty")
                    }
                    filterModel.cloneName = {
                        $regex: unidecode(trimString(req.query.name)),
                        $options: "i"
                    }
                }
                if (key === 'minPrice' || key === 'maxPrice') {
                    if (Number(req.query[key]) <= 0) {
                        throw new Error("Price must be greater than 0")
                    }
                    if (key == 'minPrice') {
                        filterModel[key] = {
                            $gte: Number(req.query[key])
                        }
                    }
                    else {
                        filterModel[key] = {
                            $lte: Number(req.query[key])
                        }
                    }
                }
                if (key === 'isOpening') {
                    if (req.query[key] !== 'true' && req.query[key] !== 'false') {
                        throw new Error("Invalid value for isOpening")
                    }
                    filterModel[key] = req.query[key] === 'true' ? true : false
                }
                if (key === 'rating') {
                    if (Number(req.query[key]) < 0 || Number(req.query[key]) > 5) {
                        throw new Error("Invalid value for rating")
                    }
                    filterModel[key] = {
                        $gte: Number(req.query[key])
                    }
                }
                if (key === 'category') {
                    filterModel[key] = {
                        $all: req.query[key].split('_')
                    }
                }
                if (key === 'city' || key === 'district') {
                    if (key === 'city') {
                        if (!cities.find(item => item.code === req.query[key])) throw new Error("Invalid city code")
                    } else {
                        if (!districts.find(item => item.code === req.query[key])) throw new Error("Invalid district code")
                    }
                    filterModel[`address.${key}`] = req.query[key]
                }
            }
            if (filterModel.minPrice && filterModel.maxPrice) {
                if (Object.values(filterModel.minPrice)[0] >= Object.values(filterModel.maxPrice)[0]) throw new Error("Min price must be less than max price")
            }
            if (filterModel['address.city'] && filterModel['address.district']) {
                const district = districts.find(item => item.code === filterModel['address.district'] && item.parent_code === filterModel['address.city'])
                if (!district) throw new Error("District code must be a child of city")
            }
            req.query = {}
            req.query.filterModel = filterModel
            next()
        } catch (error) {
            returnError(res, 403, error)
        }
    }
}

export default queryMiddleWare;