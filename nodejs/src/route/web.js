import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import restaurantController from "../controllers/restaurantController";
import customerController from "../controllers/customerController";
import typeController from "../controllers/typeController";
import dishController from "../controllers/dishController";
import staffController from "../controllers/staffController";
import tableController from "../controllers/tableController";
import orderController from "../controllers/orderController";
import paymentController from "../controllers/paymentController";

let router = express.Router();

let initWebRoutes = (app, io) => {
  router.get("/", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);

  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);

  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  router.post("/api/login", userController.handleLogin);
  router.post("/api/register", userController.handleRegister);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.post("/api/create-new-staff", userController.handleCreateNewStaff);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.get(
    "/api/get-detail-user-by-id",
    userController.handleGetDetailUserById
  );

  router.get(
    "/api/get-detail-table-by-id",
    tableController.handleGetDetailTableById
  );

  router.post("/api/create-new-table", tableController.handleCreateNewTable);
  router.post("/api/edit-table", tableController.handleEditTable);
  router.delete("/api/delete-table", tableController.handleDeleteTable);

  router.get("/api/get-all-tables", tableController.handleGetAllTables);

  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post(
    "/api/create-new-restaurant",
    restaurantController.handleCreateNewRestaurant
  );
  router.put("/api/edit-restaurant", restaurantController.handleEditRestaurant);
  router.delete(
    "/api/delete-restaurant",
    restaurantController.handleDeleteRestaurant
  );

  router.get(
    "/api/get-detail-restaurant-by-id",
    restaurantController.handleGetDetailRestaurantById
  );

  router.get(
    "/api/get-restaurant-by-location",
    restaurantController.handleGetRestaurantByLocation
  );

  router.post("/api/create-new-type", typeController.handleCreateType);
  router.get("/api/get-all-types", typeController.handleGetAllTypes);
  router.get(
    "/api/get-detail-type-by-id",
    typeController.handleGetDetailTypeById
  );

  router.get(
    "/api/get-all-restaurants",
    restaurantController.handleGetAllRestaurants
  );

  router.post("/api/book-table", (req, res) => customerController.handleBookTable(req, res, io));
  router.post(
    "/api/create-new-orderItem",
    customerController.handleCreateNewOrderItem
  );
  router.post(
    "/api/customer-pre-order-dish",
    customerController.handleCustomerPreOrderDish
  );

  router.get("/api/get-all-dishes", dishController.handleGetAllDishes);
  router.post("/api/create-new-dish", dishController.handleCreateNewDish);
  router.put("/api/edit-dish", dishController.handleEditDish);
  router.delete("/api/delete-dish", dishController.handleDeleteDish);
  router.get(
    "/api/get-detail-dish-by-id",
    dishController.handleGetDetailDishById
  );
  router.get("/api/get-all-dish-names", dishController.handleGetAllDishNames);
  router.get(
    "/api/get-all-dishRestaurant-names",
    dishController.handleGetAllDishRestaurantNames
  );

  router.get(
    "/api/get-list-customer-for-staff",
    staffController.handleGetListCustomerForStaff
  );

  router.get(
    "/api/get-restaurant-by-staffId",
    staffController.handleGetRestaurantByStaffId
  );

  router.get("/api/get-all-orders", orderController.handleGetAllOrders);
  router.put("/api/edit-order", orderController.editHandler);
  router.delete("api/delete-order", orderController.cancelHandler);
  router.post("/api/choose-table", orderController.chooseTableHandler);
  router.patch("/api/free-table", tableController.freeTableHandler);
  router.post("/api/search-table", tableController.handleSearchTable);

  router.post(
    "/api/update-status-order",
    orderController.handleUpdateStatusOrder
  );

  router.post(
    "/api/get-all-orders-of-customer",
    orderController.handleGetAllOrderByCustomerPhoneNumber
  );

  router.post(
    "/api/update-status-order",
    orderController.handleUpdateStatusOrder
  );

  router.post(
    "/api/get-all-orders-by-restaurantId",
    orderController.handleGetAllOrdersByRestaurantId
  );

  router.post(
    "/api/get-detail-order-by-orderId",
    orderController.handleGetDetailOrderByOrderId
  );

  router.post("/api/update-order", orderController.handleUpdateOrder);
  router.post("/api/update-order-item", orderController.handleUpdateOrderItem);
  router.post("/api/get-available-tables", tableController.handleGetAvailableTables);
  router.post("/api/get-all-tables-by-restaurantId", tableController.handleGetAllTableByRestaurantId);
  router.post("/api/create-order-by-staff", staffController.createOrder);
  router.post("/api/create-payment", paymentController.handlePaymentWithVNP);
  router.get("/api/vnpay_return", (req, res) =>  paymentController.handlePaymentResultWithVNP(req, res, io));
  return app.use("/", router);
};

module.exports = initWebRoutes;