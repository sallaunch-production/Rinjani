const express = require("express");
const jwt = require("jose");
const morgan = require("morgan");
const { logger } = require("./config/logger");
require("dotenv").config();
const app = express();
const authRoutes = require("./routes/authRoutes");
const bodyParser = require("body-parser");
const authenticateToken = require("./middleware/authenticateToken");
var cors = require("cors");

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms - :user-agent - :remote-addr",
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message) => logger.info(message.trim()),
    },
  }
);
app.use(morganMiddleware);
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
// Add headers before the routes are defined
app.use(bodyParser.json());
app.use("/api", authRoutes);
app.get("/api", (req, res) => {
  res.json({
    message: "welcome to agent",
  });
});
const PORT = process.env.PORT || 8032;
app.listen(PORT, () => logger.info(`server started on port ${PORT}`));
