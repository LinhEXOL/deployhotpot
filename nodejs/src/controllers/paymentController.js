const vnpService = require("../services/vnpService");

const handlePaymentWithVNP = async (req, res) => {
  try {
    let data = await vnpService.createPaymentWithVNP(req);
    return res.json(data);
  } catch (e) {
    console.log(e);
    return res.json({
      status: 500,
      message: "Error from server...",
      data: "",
    });
  }
};

const handlePaymentResultWithVNP = async (req, res, io) => {
  try {
    let data = await vnpService.getReturn(req);
    
    if(data.status === 200){
      io.emit('payment-res', 'success'); 
      return res.render("paymentSuccess");
    }
    else{
      io.emit('payment-res', 'fail'); // Emit event
      return res.render("paymentFailed");
    }
  } catch (e) {
    console.log(e);
    return res.json({
      status: 500,
      message: "Error from server...",
      data: "",
    });
  }

}


module.exports = {
    handlePaymentWithVNP,
    handlePaymentResultWithVNP
}