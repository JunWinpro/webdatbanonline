const messages = {
    phone: {
        'string.pattern.base': "Phone must be 10 numbers",
        'string.empty': "Phone is empty",
        'any.required': "Phone is required"
    },
    firstName: {
        'string.pattern.base': "First name cannot contain spaces or special characters or number",
        'string.min': "First name must have at least 1 character",
        'string.empty': "First name  is empty",
        'any.required': "First name is required"
    },
    lastName: {
        'string.pattern.base': "Last name cannot contain spaces or special characters or number",
        'string.min': "Last name must have at least 1 character",
        'string.empty': "Last name is empty",
        'any.required': "Last name is required"
    },
    restaurantId: {
        'string.hex': "Restaurant id must be a valid ObjectId",
        'string.empty': 'Restaurant id is empty',
        'any.required': 'Restaurant id is required'
    },

    table: {
        'number.base': "Table ID must be a number",
        'number.min': "Table ID must be greater than 0",
        'number.empty': "Table ID can't be empty",
        'number.integer': "Table must be integer",
    },
    numberOfTable: {
        'number.base': "Number of table must be a number",
        'number.min': "Number of table must be greater than 0",
        'number.empty': "Number of table can't be empty",
        'number.integer': "Number of table must be integer"
    },

    menu: {
        menu: {
            'array.base': "Menu must be an array",
            'array.empty': "Menu can't be empty",
            'any.required': "Menu is required"
        },
        menuItem: {
            'string.hex': "Menu item must be a valid ObjectId",
            'string.empty': 'Menu item is empty',
            'any.required': 'Menu item is required'
        },
        numberOfUnit: {
            'number.base': "Number of unit must be a number",
            'number.min': "Number of unit must be greater than 0",
            'number.empty': "Number of unit can't be empty",
            'any.required': "Number of unit is required"
        },
        note: {
            'string.base.pattern': "Note must be a string",
            'string.empty': "Note can't be empty",
        }
    },

    checkinTime: {
        'number.base': "Checkin time must be a number",
        'number.min': "Checkin time must be greater than 0",
        'number.empty': "Checkin time can't be empty",
        'any.required': "Checkin time is required",
        'number.integer': "Checkin time must be an integer",
        'number.min': "Checkin time must be greater than current time",
        'number.max': "Checkin time must be less than 14 days"
    }
}
export default messages