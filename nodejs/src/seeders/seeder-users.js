"use strict";
const bcrypt = require("bcryptjs");

// Tạo salt với số lượt lặp là 10
const salt = bcrypt.genSaltSync(10);

// Mã hóa mật khẩu
const hashedPassword = bcrypt.hashSync("123456", salt);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          email: "admin@gmail.com",
          password: hashedPassword,
          fullName: "Vu Linh",
          address: "Hanoi",
          roleId: "1",
          phoneNumber: "0123456789",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
