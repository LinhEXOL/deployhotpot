import { Model } from "sequelize";
import tableService from "../services/tableService";
// const tableDAO = require("../DAOs/tableDAO");
const orderDAO = require("../DAOs/orderDAO");
const tableDAO = require("../DAOs/tableDao");
let handleGetAllTables = async (req, res) => {
  let data = await tableService.getAllTables();
  return res.status(200).json({
    status: 200,
    message: "OK",
    data: data.data,
  });
};

let handleCreateNewTable = async (req, res) => {
  let data = await tableService.createNewTable(req.body);
  return res.json(data);
};

let handleDeleteTable = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({
      status: 400,
      message: "Missing required parameter",
      data: "",
    });
  }
  let data = await tableService.deleteTable(req.body.id);
  return res.status(data.status).json(data);
};

let handleEditTable = async (req, res) => {
  let data = await tableService.updateTableData(req.body);
  return res.status(data.status).json(data);
};

let handleGetDetailTableById = async (req, res) => {
  try {
    let data = await tableService.getDetailTableById(req.query.id);
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

const freeTableHandler = async (req, res) => {
  const tableId = req.body.id;
  const info = await tableService.freeTable({ orderDAO, tableDAO }, tableId);
  return res.status(200).json({
    success: true,
    message: "Successfully freed the chosen table!",
    item: info,
  });
};

const handleSearchTable = async (req, res) => {
  try {
    let data = await tableService.searchAvailableTables(req.body);
    return res.status(data.status).json(data);
  } catch (e) {
    console.log("Get all code error:", e);
    return res.status(500).json({
      status: 500,
      message: "Error from server...",
      data: "",
    });
  }
};

const handleGetAllTableByRestaurantId = async (req, res) => {
  try {
    let info = await tableService.getAllTablesByRestaurantId(
      req.body
    );
    return res.status(200).json(info);
  } catch (e) {
    console.log("Get all code error:", e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

const handleGetAvailableTables = async (req, res) => {
  try {
    let data = await tableService.getAvailableTables(req.body);
    return res.status(data.status).json(data);
  } catch (e) {
    console.log("Get all code error:", e);
    return res.status(500).json({
      status: 500,
      message: "Error from server...",
      data: "",
    });
  }
};

module.exports = {
  handleGetAllTables,
  handleCreateNewTable,
  handleDeleteTable,
  handleEditTable,
  handleGetDetailTableById,
  freeTableHandler,
  handleSearchTable,
  handleGetAllTableByRestaurantId,
  handleGetAvailableTables,
};
