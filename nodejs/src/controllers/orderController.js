const orderService = require("../services/orderService");

const handleGetAllOrdersByRestaurantId = async (req, res) => {
  try {
    let data = await orderService.getAllOrdersByRestaurantId(req.body);
    return res.json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "Error from server...",
      data: "",
    });
  }
};

const handleGetAllOrders = async (req, res) => {
  try {
    let data = await orderService.getAllOrders();
    return res.json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "Error from server...",
      data: "",
    });
  }
};

const handleUpdateStatusOrder = async (req, res) => {
  try {
    let data = await orderService.updateStatusOrder(req.body);
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
let handleGetDetailOrderByOrderId = async (req, res) => {
  try {
    let data = await orderService.getDetailOrderByOrderId(req.body);
    return res.json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "Error from server...",
    });
  }
};

const handleGetAllOrderByCustomerPhoneNumber = async (req, res) => {
  try {
    let data = await orderService.getAllOrdersByCustomerPhoneNumber(req.body);

    return res.status(data.status).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "Error from server...",
    });
  }
};

const handleGetAllOrderByCustomerId = async (req, res) => {
  try {
    let data = await orderService.getAllOrdersByCustomerId(req.body);

    return res.status(data.status).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "Error from server...",
    });
  }
};

const handleUpdateOrder = async (req, res, io) => {
  try {
    let data = await orderService.newUpdateOrder(req.body);
    if (data.status === 200) io.emit("update-order", "success");
    else io.emit("update-order", "fail");
    return res.status(data.status).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "Error from server...",
    });
  }
};

const handleUpdateOrderItem = async (req, res) => {
  try {
    let data = await orderService.updateOrderItem(req.body);
    return res.status(data.status).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "Error from server...",
    });
  }
};

const handleCheckoutOrder = async (req, res, io) => {
  try {
    let data = await orderService.checkoutOrder(req.body);
    if (data.status === 200) io.emit("checkout-order", "success");
    else io.emit("checkout-order", "fail");
    return res.status(data.status).json(data);
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "Error from server...",
    });
  }
};

module.exports = {
  handleGetAllOrders,
  // registerHandler,
  // editHandler,
  // cancelHandler,
  // chooseTableHandler,
  handleGetAllOrdersByRestaurantId,
  handleUpdateStatusOrder,
  handleGetAllOrderByCustomerPhoneNumber,
  handleGetDetailOrderByOrderId,
  handleUpdateOrder,
  handleUpdateOrderItem,
  handleGetAllOrderByCustomerId,
  handleCheckoutOrder,
};
