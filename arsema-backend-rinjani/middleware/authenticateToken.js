const jwt = require('jsonwebtoken');
require('dotenv').config();
const { logger } = require("../config/logger");

  function authenticateToken(req, res, next) {
    const token =
            req.headers
                .authorization.split(' ')[1];
        //Authorization: 'Bearer TOKEN'
        if (!token) {
            res.status(200)
                .json(
                    {
                        success: false,
                        message: "Error!Token was not provided."
                    }
                );
        }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).send({
                auth: false,
                message: "Error",
                errors: err
            });
        }
        req.userId = decoded.id;
        next();
        logger.info(token);
    });
  }

  module.exports =  authenticateToken 