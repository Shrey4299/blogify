const express = require("express");
const router = express.Router();

const cashfreePayment = require("../controllers/cashfree");

// phonepe routes

router.get("/cashfree", cashfreePayment.renderCashfreePage);
router.post("/cashfreePayment", cashfreePayment.makeCashfreePayment);

module.exports = router;
