import billValidateData from './bill/bill.js';
import bookingValidateData from './booking/booking.js';
import employeeValidateData from './employee/employee.js';
import menuValidateData from './menu/menu.js';
import objectIdValidate from './params/objectId.js';
import restaurantValidateData from './restaurant/restaurant.js';
import reviewValidateData from './review/review.js';
import userValidateData from './user/user.js';
const validateData = {
    objectId: objectIdValidate,
    user: userValidateData,
    employee: employeeValidateData,
    restaurant: restaurantValidateData,
    menu: menuValidateData,
    booking: bookingValidateData,
    review: reviewValidateData,
    bill: billValidateData
}

export default validateData