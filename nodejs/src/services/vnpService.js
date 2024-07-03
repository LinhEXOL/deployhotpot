const e = require("express");
import db from "../models/index";

const moment = require("moment");
const tmnCode = "HSMY45J3";
const secretKey = "P8RDKPM5JGHHJWKEDRER8WB2HZ0WHDAC";
const returnUrl = "http://localhost:8080/api/vnpay_return";
let createPaymentWithVNP = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      process.env.TZ = "Asia/Ho_Chi_Minh";

      let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
      let date = new Date();
      let createDate = moment(date).format("YYYYMMDDHHmmss");

      let ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      let orderId = req.body.orderId;
      let amount = req.body.amount;
      let bankCode = req.body.bankCode;

      let locale = req.body.language;
      if (locale === null || locale === "") {
        locale = "vn";
      }
      let currCode = "VND";
      let vnp_Params = {};
      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = orderId;
      vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
      vnp_Params["vnp_OrderType"] = "other";
      vnp_Params["vnp_Amount"] = amount * 100;
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;
      if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
      }

      vnp_Params = sortObject(vnp_Params);

      let querystring = require("qs");
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

      resolve({
        status: 200,
        message: "success",
        data: vnpUrl,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getReturn = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let vnp_Params = req.query;

      let secureHash = vnp_Params["vnp_SecureHash"];

      delete vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHashType"];

      vnp_Params = sortObject(vnp_Params);
      console.log("🚀 ~ returnnewPromise ~ vnp_Params:", vnp_Params);

      let querystring = require("qs");
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

      if (secureHash === signed) {
        let order = await db.Order.findOne({
          where: { id: vnp_Params["vnp_TxnRef"] },
        });
        if (!order) {
          resolve({
            status: 404,
            message: "Order is not exist",
            data: "",
          });
        }
        if (order.depositAmount * 100 != vnp_Params["vnp_Amount"]) {
          console.log(
            "🚀 ~ returnnewPromise ~ order.amount * 100 :",
            order.amount * 100
          );
          resolve({
            status: 400,
            message: "Amount is not match",
            data: "",
          });
        }
        if (vnp_Params["vnp_ResponseCode"] == "00") {
          await db.Order.update(
            { paymentStatus: "deposited" },
            { where: { id: vnp_Params["vnp_TxnRef"] } }
          );
          resolve({
            status: 200,
            message: "success",
          });
        } else {
          resolve({
            status: 400,
            message: "Payment failed",
          });
        }
      } else {
        reject("Invalid signature");
      }
    } catch (e) {
      reject(e);
    }
  });
};

const vnpayIPN = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      let vnp_Params = req.query;

      let secureHash = vnp_Params["vnp_SecureHash"];

      delete vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHashType"];

      vnp_Params = sortObject(vnp_Params);

      let config = require("config");
      let tmnCode = config.get("vnp_TmnCode");
      let secretKey = config.get("vnp_HashSecret");

      let querystring = require("qs");
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

      if (secureHash === signed) {
        res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
      } else {
        res.render("success", { code: "97" });
      }
    } catch (e) {
      reject(e);
    }
  });
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = {
  createPaymentWithVNP,
  getReturn,
};
