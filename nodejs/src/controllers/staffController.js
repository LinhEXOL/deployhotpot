import staffService from "../services/staffService";
import orderService from "../services/orderService";
let handleGetListCustomerForStaff = async (req, res) => {
  try {
    let info = await staffService.getListCustomerForStaff(
      req.query.staffId,
      req.query.date
    );
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

let handleGetRestaurantByStaffId = async (req, res) => {
  try {
    let info = await staffService.getRestaurantByStaffId(req.query.staffId);
    return res.status(200).json(info);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server...",
    });
  }
};

const createOrder = async (req, res) => {
  try {
    let data = await orderService.createOrderByStaff(req.body);
    return res.status(data.status).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "Error from server...",
      data: "",
    });
  }
};

module.exports = {
  handleGetListCustomerForStaff,
  handleGetRestaurantByStaffId,
  createOrder
};
