const express = require("express");
const db = require("../models/index");
const shortUUID = require("short-uuid");
const moment = require("moment");
const mailer = require("./mailService");

const tmnCode = process.env.VNP_TMN_CODE;
const secretKey = process.env.VNP_HASH_SECRET;
const returnUrl = process.env.VNP_RETURN_URL;

const createPaymentWithVNP = async (req) => {
  try {
    process.env.TZ = "Asia/Ho_Chi_Minh";

    if (req.body.type === "deposit") {
      let res = await createOrder(req.body.order);
      if (res.status !== 200) {
        return res;
      }
      req.body.orderId = res.order.id;
      req.body.change = 0;
      req.body.amount = res.order.depositAmount;
    }

    let invoice = await db.Invoice.create({
      id: shortUUID.generate(),
      orderId: req.body.orderId,
      received: req.body.received,
      type: req.body.type,
      change: req.body.change,
    });

    let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");

    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    let orderId = invoice.id;
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = req.body.language || "vn";
    let currCode = "VND";

    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: `Thanh toan cho ma GD:${orderId}`,
      vnp_OrderType: "other",
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const querystring = require("qs");
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

    return {
      status: 200,
      message: "success",
      data: vnpUrl,
    };
  } catch (e) {
    throw e;
  }
};

const getReturn = async (req) => {
  try {
    const vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    const sortedParams = sortObject(vnp_Params);
    const querystring = require("qs");
    const signData = querystring.stringify(sortedParams, { encode: false });
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      throw new Error("Invalid signature");
    }

    const invoice = await db.Invoice.findOne({
      where: { id: vnp_Params["vnp_TxnRef"] },
      raw: false,
    });

    if (!invoice) {
      return {
        status: 404,
        message: "Order is not exist",
      };
    }

    const order = await db.Order.findOne({
      where: { id: invoice.orderId },
      raw: false,
    });

    if (
      invoice.type === "deposit" &&
      invoice.received !== vnp_Params["vnp_Amount"] / 100
    ) {
      return {
        status: 400,
        message: "Amount is not match",
      };
    }

    if (
      invoice.type === "checkout" &&
      order.totalAmount - order.depositAmount !== vnp_Params["vnp_Amount"] / 100
    ) {
      return {
        status: 400,
        message: "Amount is not match",
      };
    }

    if (vnp_Params["vnp_ResponseCode"] == "00") {
      if (invoice.type === "deposit") {
        order.paymentStatus = "deposited";
        order.resStatus = "confirmed";
        await order.save();
      }
      if (invoice.type === "checkout") {
        order.paymentStatus = "paid";
        order.resStatus = "done";
        await order.save();
      }
      if (invoice.type === "refund") {
        order.paymentStatus = "refunded";
        order.resStatus = "cancel";
        await order.save();
      }
      invoice.status = "success";
      await mailer.notifyOrderPlaceSuccess(order);
      await invoice.save();
      return {
        status: 200,
        message: "success",
        orderId: order.id,
      };
    } else {
      if (invoice.type === "deposit") {
        await db.Order.destroy({
          where: { id: invoice.orderId },
        });
        await db.OrderItem.destroyAll({
          where: { orderId: invoice.orderId },
        });
      }
      invoice.status = "failed";
      await invoice.save();
      return {
        status: 400,
        message: "Payment failed",
      };
    }
  } catch (e) {
    throw e;
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }

  str.sort();

  for (let i = 0; i < str.length; i++) {
    sorted[str[i]] = encodeURIComponent(obj[str[i]]).replace(/%20/g, "+");
  }

  return sorted;
}

module.exports = {
  createPaymentWithVNP,
  getReturn,
};
