const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("../models/User");
const AuthGoogle = require("../models/Auth_google");
const { logger } = require("../config/logger");
const Role = require("../models/Roles");
const { generateSecret, generateQRCode, verify } = require("../config/2fa");
const QRCode = require("qrcode");
const secretKey = process.env.TOKEN_SECRET;
const { authenticator } = require("otplib");
const crypto = require("crypto");
const moment = require("moment-timezone");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const nodemailer = require("nodemailer");
const timestamp_id = moment()
  .tz("Asia/Jakarta")
  .format("YYYY-MM-DDTHH:mm:ss+07:00");

async function signin(req, res) {
  return User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then(async (user) => {
      if (!user) {
        logger.error("Response: User or Password Is Incorrect.");
        return res.status(404).send({
          auth: false,
          email: req.body.email,
          accessToken: null,
          message: "Error",
          errors: "User or Password Is Incorrect.",
        });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        logger.error("Response: User or Password Is Incorrect.");
        return res.status(401).send({
          auth: false,
          email: req.body.email,
          accessToken: null,
          message: "Error",
          errors: "User or Password Is Incorrect.",
        });
      }
      const rolesa = await Role.findAll({
        raw: true,
        where: {
          email: req.body.email,
        },
      });

      const token = jwt.sign(
        { email: req.body.email, name: user.name, roles: rolesa },
        secretKey,
        { expiresIn: "12h" }
      );
      logger.info("Login is success:" + req.body.email);
      User.update(
        { remember_token: token },
        {
          where: {
            email: req.body.email,
          },
        }
      );
      res.status(200).send({
        auth: true,
        email: req.body.email,
        accessToken: token,
        message: "",
        errors: "",
      });
    })
    .catch((err) => {
      res.status(500).send({
        auth: false,
        id: req.body.email,
        accessToken: null,
        message: "Error",
        errors: err,
      });
      logger.error("Response:" + err);
    });
}

async function setup2fa(req, res) {
  const user = req.body.email;
  const secret = generateSecret();
  console.log(user);
  console.log(secret);
  // save user to database
  return User.findOne({
    where: {
      email: req.body.email,
    },
  }).then(async (user) => {
    if (!user) {
      logger.error("Response: User or Password Is Incorrect.");
      return res.status(404).send({
        auth: false,
        email: req.body.email,
        accessToken: null,
        status: "error",
        errors: "User or Password Is Incorrect.",
      });
    }

    AuthGoogle.findOne({
      raw: true,
      where: {
        username: req.body.email,
      },
    }).then(async (transaction) => {
      if (!transaction) {
        const otp = authenticator.keyuri(req.body.email, "Arsema V3", secret);
        AuthGoogle.create({
          username: req.body.email,
          code: secret,
          created_at: moment()
            .tz("Asia/Jakarta")
            .format("YYYY-MM-DDTHH:mm:ss+07:00"),
          updated_at: moment()
            .tz("Asia/Jakarta")
            .format("YYYY-MM-DDTHH:mm:ss+07:00"),
        });
        QRCode.toDataURL(otp, (err, imageUrl) => {
          if (err) {
            console.log("Could not generate QR code", err);
            return;
          }
          res.status(200).send({ status: "success", imageUrl: imageUrl });
        });
      } else {
        res.status(200).send({ status: "false", imageUrl: "" });
      }
    });
  });
}

async function verify2fa(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  User.findOne({
    where: {
      email: req.body.email,
      remember_token: token,
    },
  }).then(async (user) => {
    if (!user) {
      return res.status(200).send({ message: "Not allowed" });
    } else {
      AuthGoogle.findOne({
        raw: true,
        where: {
          username: req.body.email,
        },
      }).then(async (transaction) => {
        if (!transaction) {
          return res.status(200).send({ message: "Not registered" });
        } else {
          const valid = authenticator.verify({
            secret: transaction.code,
            token: req.body.token,
          });
          // save user to database

          if (valid) {
            const rolesa = await Role.findAll({
              raw: true,
              where: {
                email: req.body.email,
              },
            });
            const token = jwt.sign(
              {
                email: req.body.email,
                name: req.body.name,
                roles: rolesa,
                agentid: user.agentid,
              },
              secretKey,
              { expiresIn: "12h" }
            );
            return res.status(200).send({
              message: "success",
              email: req.body.email,
              accessToken: token,
              errors: "",
              status: true,
            });
          }
          return res.status(200).send({ message: "false" });
        }
      });
    }
  });
}

async function changepass(req, res) {
  return User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then(async (user) => {
      if (!user) {
        logger.error("Response: User or Password Is Incorrect.");
        return res.status(404).send({
          auth: false,
          email: req.body.email,
          accessToken: null,
          message: "Error",
          errors: "User or Password Is Incorrect.",
        });
      }

      logger.info("Change password is success: " + req.body.email);
      User.update(
        {
          password: bcrypt.hashSync(req.body.password, 8),
          last_update: moment().format(),
        },
        {
          where: {
            email: req.body.email,
          },
        }
      );
      const mailData = {
        from: "no-reply@arsema.co.id", // sender address
        to: req.body.email, // list of receivers
        subject: "Password has changed",
        text: "",
        html: await readFile("mail/index.html", "utf8"),
        //html: 'Your password already changed'
      };
      const transporter = nodemailer.createTransport({
        port: 465, // true for 465, false for other ports
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        secure: true,
      });

      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          logger.error("Response:" + error);
          return false;
        }
        logger.info("Response:" + error);
        return true;
      });
      res.status(200).send({
        auth: true,
        email: req.body.email,

        message: "Password changed successfully",
      });
    })
    .catch((err) => {
      res.status(500).send({
        auth: false,
        id: req.body.email,
        accessToken: null,
        message: "Error",
        errors: err,
      });
      logger.error("Response:" + err);
    });
}

async function checkexpired(req, res) {
  return User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then(async (user) => {
      if (!user) {
        logger.error("Response: User or Password Is Incorrect.");
        return res.status(404).send({
          auth: false,
          email: req.body.email,
          accessToken: null,
          message: "Error",
          errors: "User or Password Is Incorrect.",
        });
      }

      logger.info("Password expired: " + req.body.email);
      var tgl_ak = moment(user.last_update);
      var tgl_aw = moment().format("YYYY-MM-DD HH:mm:ss");
      console.log(tgl_aw);
      var numDays;

      numDays = tgl_ak.diff(tgl_aw, "days");
      console.log(numDays);
      if (
        numDays < -30 ||
        user.last_update === null ||
        user.last_update == ""
      ) {
        res.status(200).send({
          email: req.body.email,
          status: "error",
          message: "Password is expired",
        });
      } else {
        res.status(200).send({
          email: req.body.email,
          status: "success",
          message: "Password is active",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        email: req.body.email,
        status: "error",
        message: "Error" + err,
      });
      logger.error("Response:" + err);
    });
}
module.exports = { signin, setup2fa, verify2fa, changepass, checkexpired };
