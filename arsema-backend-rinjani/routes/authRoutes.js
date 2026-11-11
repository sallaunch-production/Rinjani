const express = require("express");
require("dotenv").config();
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const DataController = require("../controllers/SendController");
const ReceiveController = require("../controllers/ReceiveController");
const authenticateToken = require("../middleware/authenticateToken");
const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
router.post("/signin", AuthController.signin);
router.get("/mailtest", DataController.mailtest);
// Protected route example
router.get("/protected", authenticateToken, (req, res) => {
  // Your protected route logic here
  res.json({ message: "This is a protected route" });
  return res;
});
router.post("/changepass", authenticateToken, AuthController.changepass);
router.post("/setup2fa", authenticateToken, AuthController.setup2fa);
router.post("/verify2fa", authenticateToken, AuthController.verify2fa);
router.post("/country-info", authenticateToken, DataController.countryInfo);
router.post("/province-info", authenticateToken, DataController.provinceInfo);
router.post("/send", authenticateToken, DataController.send);
router.post("/send-gfpp", authenticateToken, DataController.sendgfpp);
router.post(
  "/send-validation",
  authenticateToken,
  DataController.sendvalidation
);
router.post("/send-commit", authenticateToken, DataController.sendcommit);
router.post("/detail-lookup", authenticateToken, DataController.detaillookup);
router.post(
  "/detail-lookup-pos",
  authenticateToken,
  DataController.detaillookuppos
);
router.post(
  "/detail-lookup-refnumber",
  authenticateToken,
  DataController.detaillookuprefnumber
);
router.post(
  "/detail-lookup-refnumber-pos",
  authenticateToken,
  DataController.detaillookuprefnumberpos
);
router.post("/receive", authenticateToken, ReceiveController.receive);
router.post("/receive-gfpp", authenticateToken, ReceiveController.receivegfpp);
router.post(
  "/receive-validation",
  authenticateToken,
  ReceiveController.receivevalidation
);
router.post(
  "/receive-commit",
  authenticateToken,
  ReceiveController.receivecommit
);
router.post(
  "/detail-receive",
  authenticateToken,
  ReceiveController.detailreceive
);
router.post(
  "/detail-receive-temp",
  authenticateToken,
  ReceiveController.detailreceivetemp
);
router.post(
  "/list-receive",
  authenticateToken,
  ReceiveController.listTransactionReceive
);
router.post(
  "/list-receive-pg",
  authenticateToken,
  ReceiveController.listTransactionReceivePG
);
router.post(
  "/list-receive-all",
  authenticateToken,
  ReceiveController.listTransactionReceiveAll
);
router.post(
  "/list-transaction",
  authenticateToken,
  DataController.listTransaction
);
router.post(
  "/list-transaction-ok",
  authenticateToken,
  DataController.listTransactionOK
);
router.post(
  "/list-transaction-rcv-ok",
  authenticateToken,
  ReceiveController.listTransactionOK
);
router.post(
  "/list-transaction-today",
  authenticateToken,
  DataController.listTransactionToday
);
router.post(
  "/list-transaction-agent",
  authenticateToken,
  DataController.listTransactionSendByAgent
);

router.post(
  "/list-transaction-agent-month",
  authenticateToken,
  DataController.listTransactionSendByAgentMonth
);
router.post(
  "/list-transaction-rcv-agent",
  authenticateToken,
  ReceiveController.listTransactionByAgent
);

router.post(
  "/list-transaction-agent-rcv-month",
  authenticateToken,
  ReceiveController.listTransactionByAgentMonth
);
router.post(
  "/detail-transaction",
  authenticateToken,
  DataController.detailtransaction
);
router.post(
  "/detail-transaction-send",
  authenticateToken,
  DataController.detailtransactionsend
);

router.post("/detail-agentid", authenticateToken, DataController.detailAgentID);
router.post(
  "/detail-transaction-send-pos",
  authenticateToken,
  DataController.detailtransactionsendpos
);
router.post(
  "/detail-send-refnumber",
  authenticateToken,
  DataController.detailtransactionsendref
);
router.post(
  "/detail-send-pos-refnumber",
  authenticateToken,
  DataController.detailtransactionsendposref
);
router.post("/send-check", authenticateToken, DataController.sendcheck);
router.post("/send-reject", authenticateToken, DataController.sendreject);
router.post(
  "/count-transaction",
  authenticateToken,
  DataController.countTransaction
);

router.post(
  "/receive-check",
  authenticateToken,
  ReceiveController.receivecheck
);
router.post(
  "/receive-reject",
  authenticateToken,
  ReceiveController.receivereject
);
router.post(
  "/count-transaction-receive",
  authenticateToken,
  ReceiveController.countTransactionRcv
);

router.post("/check-expired", authenticateToken, AuthController.checkexpired);
module.exports = router;
