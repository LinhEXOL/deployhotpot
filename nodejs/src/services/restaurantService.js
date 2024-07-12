import db from "../models/index";
const _ = require("lodash");

let getAllRestaurants = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let restaurants = await db.Restaurant.findAll();
      resolve({
        status: 200,
        message: "OK",
        data: restaurants,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllTypeNames = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let typeNames = await db.Type.findAll({
        attributes: {
          exclude: ["image"],
        },
      });

      resolve({
        errCode: 0,
        data: typeNames,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let checkExistRestaurant = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await db.Restaurant.findOne({
        where: { address: address },
      });
      if (res) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let createNewRestaurant = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let isExistRestaurant = await checkExistRestaurant(data.address);
      if (isExistRestaurant) {
        return resolve({
          status: 400,
          message: "Restaurant is exist, please enter other restaurant",
          data: "",
        });
      }
      let restaurant = await db.Restaurant.create({
        name: data.name,
        province: data.province,
        image: data.image,
        address: data.address,
        longitude: data.longitude,
        latitude: data.latitude,
      });
      resolve({
        status: 200,
        message: "OK",
        data: restaurant,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let deleteRestaurant = (restaurantId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const restaurant = await db.Restaurant.findOne({
        where: { id: restaurantId },
        raw: false,
      });
      if (!restaurant) {
        return resolve({
          status: 404,
          message: "restaurant is not exist!",
          data: "",
        });
      } else {
        await restaurant.save();
        return resolve({
          status: 200,
          message: "Delete the table succeeds! (Restaurant still exists in db)",
          data: restaurant,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let updateRestaurantData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        return resolve({
          status: 400,
          message: "Missing required parameter",
          data: "",
        });
      }
      let restaurant = await db.Restaurant.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (restaurant) {
        for (let key in data) {
          if (key !== "id" && data[key] !== null) {
            restaurant[key] = data[key];
          }
        }
        await restaurant.save();
        return resolve({
          status: 200,
          message: "Update the restaurant succeeds!",
          data: restaurant,
        });
      } else {
        return resolve({
          status: 404,
          message: "Restaurant is not exist",
          data: "",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDetailRestaurantById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        return resolve({
          status: 400,
          message: "Missing required parameter!",
          data: "",
        });
      } else {
        let data = await db.Restaurant.findOne({
          where: { id: inputId },
        });
        if (data) {
          return resolve({
            status: 200,
            message: "OK",
            data: data,
          });
        } else {
          return resolve({
            status: 404,
            message: "Restaurant is not exist",
            data: "",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getRestaurantByLocation = (location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!location) {
        resolve({
          status: 400,
          message: "Missing required parameter!",
          data: "",
        });
      } else {
        let restaurants = [];
        if (location === "ALL") {
          restaurants = await db.Restaurant.findAll({});
        } else {
          //find by location
          restaurants = await db.Restaurant.findAll({
            where: { province: location },
          });
        }
        if (restaurants && restaurants.length != 0) {
          resolve({
            status: 200,
            message: "OK",
            data: restaurants,
          });
        } else {
          resolve({
            status: 200,
            message: "There is not any restaurant.",
            data: "",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewRestaurant: createNewRestaurant,
  deleteRestaurant: deleteRestaurant,
  updateRestaurantData: updateRestaurantData,
  getDetailRestaurantById: getDetailRestaurantById,
  getAllRestaurants: getAllRestaurants,
  getAllTypeNames: getAllTypeNames,
  getRestaurantByLocation: getRestaurantByLocation,
};
