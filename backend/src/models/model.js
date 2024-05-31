import BillModel from "./db_models/bill.model.js";
import BookingModel from "./db_models/booking.model.js";
import EmployeeModel from "./db_models/employee.model.js";
import MenuModel from "./db_models/menu.model.js";
import RestaurantModel from "./db_models/restaurant.model.js";
import RestaurantInfoModel from "./db_models/restaurantInfo.model.js";
import ReviewModel from "./db_models/review.model.js";
import UserModel from "./db_models/user.model.js";
import UserInfoModel from "./db_models/userInfo.model.js";


const Model = {
    UserModel,
    UserInfoModel,
    RestaurantModel,
    RestaurantInfoModel,
    EmployeeModel,
    MenuModel,
    ReviewModel,
    BillModel,
    BookingModel
}
export default Model