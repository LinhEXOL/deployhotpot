"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dish extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //define association here
      Dish.belongsTo(models.Category, {
        foreignKey: "categoryId",
        targetKey: "id",
      });
      Dish.belongsTo(models.OrderItem, { foreignKey: "id" });
    }
  }
  Dish.init(
    {
      name: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.BLOB("long"),
      },
      price: {
        type: DataTypes.DOUBLE,
      },
      description: {
        type: DataTypes.TEXT("long"),
      },
      categoryId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Dish",
    }
  );
  return Dish;
};
