const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/order
router.post('/order', async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        error: "Amount is required and must be a number greater than zero" 
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // automatic capture
    };

    const order = await razorpay.orders.create(options);

    if (!order || !order.id) {
      return res.status(500).json({
        success: false,
        error: "Failed to create order. Try again later."
      });
    }

    // Mandatory change: return `success` and `order` object
    res.status(200).json({
      success: true,
      order: {
        id: order.id,
        currency: order.currency,
        amount: order.amount,
      }
    });

  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error. Unable to create order."
    });
  }
});

module.exports = router;

