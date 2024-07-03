import dishService from "../services/dishService";
let handleGetAllDishes = async (req, res) => {
  let data = await dishService.getAllDishes();
  return res.status(200).json({
    status: 200,
    message: "OK",
    data: data.data,
  });
};

let handleGetAllDishNames = async (req, res) => {
  try {
    let dishNames = await dishService.getAllDishNames();
    return res.status(200).json(dishNames);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: -1,
      message: "Error from server",
    });
  }
};

let handleGetAllDishRestaurantNames = async (req, res) => {
  try {
    let dishRestaurantNames = await dishService.getAllDishRestaurantNames();
    return res.status(200).json(dishRestaurantNames);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      status: -1,
      message: "Error from server",
    });
  }
};

let handleCreateNewDish = async (req, res) => {
  let data = await dishService.createNewDish(req.body);
  return res.status(data.status).json(data);
};

let handleGetDetailDishById = async (req, res) => {
  try {
    let data = await dishService.getDetailDishById(req.query.id);
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

let handleDeleteDish = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({
      status: 400,
      message: "Missing required parameter",
      data: "",
    });
  }
  let data = await dishService.deleteDish(req.body.id);
  return res.status(data.status).json(data);
};

let handleEditDish = async (req, res) => {
  let data = await dishService.updateDishData(req.body);
  return res.status(data.status).json(data);
};
module.exports = {
  handleGetAllDishes,
  handleGetAllDishNames,
  handleGetAllDishRestaurantNames,
  handleCreateNewDish,
  handleGetDetailDishById,
  handleDeleteDish,
  handleEditDish,
};
