const messages = {
    name: {
        'string.pattern.base': "Name cannot contain spaces or special characters or number",
        'string.empty': "Name is empty",
        'any.required': "Name is required"
    },
    description: {
        'string.pattern.base': "Description cannot contain spaces or special character",
        'string.empty': "Description  is empty",
        'any.required': "Description is required"
    },
    type: {
        'any.required': "Type is required",
        'string.empty': "Type is empty",
        'any.only': "Type must be food or drink",
    },

    unit: {
        'any.required': "Unit is required",
        'string.empty': "Unit is empty",
        'any.only': "Unit must be plate or cup",
    },

    price: {
        'any.required': "Price is required",
        'number.base': "Price must be a number",
        'number.min': "Price must be 0 or higher",

    },

    discount: {
        'any.required': "Discount is required",
        'number.base': "Discount must be a number",
        'number.min': "Discount must be 0 or higher",
        'number.max': "Discount must be lower or equal to 100"
    },

    restaurantId: {
        'string.hex': "Restaurant id must be a valid ObjectId",
        'string.empty': 'Restaurant id is empty',
        'any.required': 'Restaurant id is required',
        'string.length': 'Restaurant id must be 24 characters long'
    }
}

export default messages