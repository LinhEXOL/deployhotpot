import restaurantService from "../services/restaurantService";

let handleGetAllRestaurants = async (req, res) => {
  try {
    let data = await restaurantService.getAllRestaurants();
    return res.json({
      status: 200,
      message: "OK",
      data: data.data,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      status: 500,
      message: "Error from server...",
      data: "",
    });
  }
};

let handleCreateNewRestaurant = async (req, res, io) => {
  let data = await restaurantService.createNewRestaurant(req.body);
  if (data.status === 200) {
    io.sockets.emit("update-restaurant-data", "success");
  }
  return res.json(data);
};

let handleDeleteRestaurant = async (req, res, io) => {
  if (!req.body.id) {
    return res.json({
      status: 400,
      message: "Missing required parameter",
      data: "",
    });
  }
  let data = await restaurantService.deleteRestaurant(req.body.id);
  if (data.status === 200) {
    io.sockets.emit("update-restaurant-data", "success");
  }
  return res.json(data);
};

let handleEditRestaurant = async (req, res, io) => {
  let data = await restaurantService.updateRestaurantData(req.body);
  if (data.status === 200) {
    io.sockets.emit("update-restaurant-data", "success");
  }
  return res.json(data);
};

let handleGetDetailRestaurantById = async (req, res) => {
  try {
    let data = await restaurantService.getDetailRestaurantById(req.query.id);
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

let handleGetRestaurantByLocation = async (req, res) => {
  try {
    let data = await restaurantService.getRestaurantByLocation(
      req.query.location
    );

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
  handleGetAllRestaurants: handleGetAllRestaurants,
  handleCreateNewRestaurant: handleCreateNewRestaurant,
  handleEditRestaurant: handleEditRestaurant,
  handleDeleteRestaurant: handleDeleteRestaurant,
  handleGetDetailRestaurantById: handleGetDetailRestaurantById,
  handleGetRestaurantByLocation: handleGetRestaurantByLocation,
};
