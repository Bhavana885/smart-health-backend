const createRazorpayOrder = async (amount) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/payment/order`,
      { amount }
    );

    if (!response.data.success) {
      console.error("Order creation failed:", response.data.error);
      return null;
    }

    return response.data.order; // order.id, order.amount, order.currency
  } catch (err) {
    console.error("Error creating Razorpay order:", err.response?.data || err);
    return null;
  }
};
