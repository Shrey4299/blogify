require("dotenv").config();
const db = require("../../../services/index");
const axios = require("axios");

const renderCashfreePage = async (req, res) => {
  try {
    res.render("cashfree");
  } catch (error) {
    console.log(error.message);
  }
};

const makeCashfreePayment = async (req, res) => {
  try {
    console.log("entered make phonepe payment");

    console.log(JSON.stringify(req.body) + " this is body");

    const { payment, couponCode, UserId, VariantId, quantity } = req.body;

    if (!UserId || !payment) {
      return res.status(400).send({
        message: "User and payment method are required fields!",
      });
    }

    const discount = await db.discounts.findOne({
      where: { name: couponCode },
    });

    const variant = await db.variants.findByPk(VariantId);

    const finalPrice = discount
      ? variant.price * quantity - discount.discountPercentage
      : variant.price * quantity;

    const user = await db.users.findByPk(UserId);

    const address = await db.address.findOne({
      where: { UserId: UserId },
    });

    const orderData = {
      price: finalPrice,
      UserId: UserId,
      payment: payment,
      status: "new",
      address: address.id,
      isPaid: false,
    };

    const createdOrder = await db.orders.create(orderData);

    const order = await db.orders.findByPk(createdOrder.id);

    const [orderVariant, created] = await db.ordervariants.findOrCreate({
      where: {
        VariantId: VariantId,
        OrderId: order.id,
      },
      defaults: {
        quantity: quantity,
        price: variant.price,
        OrderId: order.id,
        VariantId: VariantId,
      },
    });

    const newPrice = order.price + quantity * variant.price;
    await order.update({ price: newPrice });

    const amount = newPrice;
    const mainId = order.id;

    // Add your Axios request here
    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/links",
      {
        customer_details: {
          customer_phone: user.phoneNumber,
          customer_email: user.email,
        },
        link_notify: {
          send_sms: true,
          send_email: true,
        },
        link_id: order.slug,
        link_amount: amount,
        link_currency: "INR",
        link_purpose: "Payment for PlayStation 11",
      },
      {
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "x-api-version": "2022-09-01",
          "x-client-id": "TEST100477139bc65c3fa4e72cea6bcd31774001",
          "x-client-secret": "TEST60e243649d0a73ed9177eb69fc11f88c733305ae",
        },
      }
    );

    const result = response.data;
    console.log(JSON.stringify(result) + "this is response");
    console.log(result.link_url);
    res.redirect(result.link_url);
  } catch (error) {
    const errMessage = error.response ? error.response.data : error.message;
    console.log(errMessage);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

module.exports = {
  renderCashfreePage,
  makeCashfreePayment,
};
