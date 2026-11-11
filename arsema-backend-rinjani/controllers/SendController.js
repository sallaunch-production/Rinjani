const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const CountrySend = require("../models/Country_Send");
const User = require("../models/User");
const ProvinceSend = require("../models/Province_Send");
const Transaksi_send_temp = require("../models/Transaksi_Send_Temp");
const Transaksi_send = require("../models/Transaksi_Send");
const Transaksi_send_pos = require("../models/Transaksi_Send_pos");
const Transaksi_cancel = require("../models/Transaksi_cancel");
const Agent_id = require("../models/Agent_id");
const Amend = require("../models/Amend");
const Roles = require("../models/Roles");
var parseString = require("xml2js").parseString;
const { Op, QueryTypes } = require("sequelize");
const soap = require("soap");
require("dotenv").config();
const { logger } = require("../config/logger");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { sq } = require("../config/db");
const { bind, name } = require("body-parser");
function formatXml(xml, tab) {
  // tab = optional indent value, default is tab (\t)
  var formatted = "",
    indent = "";
  tab = tab || "\t";
  xml.split(/>\s*</).forEach(function (node) {
    if (node.match(/^\/\w/)) indent = indent.substring(tab.length); // decrease indent by one 'tab'
    formatted += indent + "<" + node + ">\r\n";
    if (node.match(/^<?\w[^>]*[^\/]$/)) indent += tab; // increase indent
  });
  return formatted.substring(1, formatted.length - 3);
}

async function mailtest(req, res) {}

async function detailtransaction(req, res) {
  return Transaksi_send_temp.findOne({
    where: {
      mgisession: req.body.id,
    },
  })
    .then((transaction) => {
      if (!transaction) {
        logger.error("Transaction is not found");
        return res.status(404).send({
          message: "error",
          errors: "Country is not found",
        });
      }

      res.status(200).send({
        transaction,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error",
        errors: err,
      });
      logger.error("Error : " + err);
    });
}

async function detailtransactionsendref(req, res) {
  return Transaksi_send.findOne({
    where: {
      no_referensi: req.body.referenceNumber,
    },
    order: [["created_at", "DESC"]],
  })
    .then((transaction) => {
      if (!transaction) {
        logger.error("Transaction is not found");
        return res.status(404).send({
          message: "error",
          errors: "Transaction is not found",
        });
      }

      res.status(200).send({
        transaction,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error",
        errors: err,
      });
      logger.error("Error : " + err);
    });
}

async function detailtransactionsendposref(req, res) {
  return Transaksi_send_pos.findOne({
    where: {
      no_referensi: req.body.referenceNumber,
    },
    order: [["created_at", "DESC"]],
  })
    .then((transaction) => {
      if (!transaction) {
        logger.error("Transaction is not found");
        return res.status(404).send({
          message: "error",
          errors: "Transaction is not found",
        });
      }

      res.status(200).send({
        transaction,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error",
        errors: err,
      });
      logger.error("Error : " + err);
    });
}

async function detailtransactionsend(req, res) {
  return Transaksi_send.findOne({
    where: {
      mgisession: req.body.id,
    },
  })
    .then((transaction) => {
      if (!transaction) {
        logger.error("Transaction is not found");
        return res.status(404).send({
          message: "error",
          errors: "Transaction is not found",
        });
      }

      res.status(200).send({
        transaction,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error",
        errors: err,
      });
      logger.error("Error : " + err);
    });
}

async function detailAgentID(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const isijson = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  const transaksi_send = await Transaksi_send.findOne({
    where: {
      mgisession: req.body.id,
    },
  });
  if (!transaksi_send) {
    res.status(200).send({
      message: "error",
      errors: "not found",
    });
  }
  return Agent_id.findOne({
    where: {
      agent_id: isijson.agentid,
    },
  })
    .then((transaction) => {
      if (!transaction) {
        logger.error("Agent id is not found");
        return res.status(404).send({
          message: "error",
          errors: "Agent id is not found",
        });
      }

      res.status(200).send({
        transaction,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error",
        errors: err,
      });
      logger.error("Error : " + err);
    });
}

async function detailtransactionsendpos(req, res) {
  return Transaksi_send_pos.findOne({
    where: {
      mgisession: req.body.id,
    },
  })
    .then((transaction) => {
      if (!transaction) {
        logger.error("Transaction is not found");
        return res.status(404).send({
          message: "error",
          errors: "Transaction is not found",
        });
      }

      res.status(200).send({
        transaction,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error",
        errors: err,
      });
      logger.error("Error : " + err);
    });
}
async function provinceInfo(req, res) {
  return ProvinceSend.findAll({
    where: {
      countryCode: req.body.countryCode,
    },
    order: [["stateProvinceName", "ASC"]],
  })
    .then((province_info) => {
      if (!province_info) {
        logger.error("Province is not found");
        return res.status(404).send({
          message: "error",
          errors: "Province is not found",
        });
      }

      res.status(200).send({
        province_info,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error",
        errors: err,
      });
      logger.error("Error : " + err);
    });
}
async function countryInfo(req, res) {
  return CountrySend.findAll({
    where: {
      receiveactive: "1",
    },
    order: [["countryname", "ASC"]],
  })
    .then((country_info) => {
      if (!country_info) {
        logger.error("Country is not found");
        return res.status(404).send({
          message: "error",
          errors: "Country is not found",
        });
      }

      res.status(200).send({
        country_info,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error",
        errors: err,
      });
      logger.error("Error : " + err);
    });
}
async function countTransaction(req, res) {
  if (req.body.status == "") {
    const count = await Transaksi_send_temp.count({
      where: {
        created_at: {
          [Op.gt]: moment
            .tz(req.body.tanggal, "Asia/Jakarta")
            .format("YYYY-MM-DD"),
        },
      },
    });
    var params = {
      message: "success",
      total: count,
    };
    if (count == 0) {
      logger.error("Transaction is not found");
      return res.status(200).send(params);
    }

    logger.info("Response:" + params);
    return res.status(200).send(params);
  } else {
    const count = await Transaksi_send_temp.count({
      where: {
        status_cta: req.body.status,
        created_at: {
          [Op.gt]: moment
            .tz(req.body.tanggal, "Asia/Jakarta")
            .format("YYYY-MM-DD"),
        },
      },
    });
    var params = {
      message: "success",
      total: count,
    };
    if (count == 0) {
      logger.error("Transaction is not found");
      return res.status(200).send(params);
    }

    logger.info("Response:" + params);
    return res.status(200).send(params);
  }
}

async function listTransactionSendByAgent(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const isijson = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  const agentids = await Agent_id.findOne({
    where: { agent_id: isijson.agentid },
  });

  const transaction = await sq.query(
    "select nama,agent_id, (select count(no) from transaksi_send_clients where agent_id=agent_id.agent_id and created_at::text like $created_at) as total from agent_id where corporate = $corporate",
    {
      type: QueryTypes.SELECT,
      bind: {
        corporate: agentids.corporate,
        created_at:
          moment.tz(req.body.tanggal, "Asia/Jakarta").format("YYYY-MM-DD") +
          "%",
      },
    }
  );
  res.status(200).send(transaction);
}

async function listTransactionSendByAgentMonth(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const isijson = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  const agentids = await Agent_id.findOne({
    where: { agent_id: isijson.agentid },
  });

  const transaction = await sq.query(
    "select nama,agent_id, (select count(no) from transaksi_send_clients where agent_id=agent_id.agent_id and created_at::text like $created_at) as total from agent_id where corporate = $corporate",
    {
      type: QueryTypes.SELECT,
      bind: {
        corporate: agentids.corporate,
        created_at:
          moment.tz(req.body.tanggal, "Asia/Jakarta").format("YYYY-MM") + "%",
      },
    }
  );
  res.status(200).send(transaction);
}

async function listTransaction(req, res) {
  return Transaksi_send_temp.findAll({
    where: {
      status_cta: req.body.status,
      mgisession: {
        [Op.ne]: "",
      },
    },
    order: [["created_at", "DESC"]],
  })
    .then((transaksi_send_temp) => {
      if (!transaksi_send_temp) {
        logger.error("Transaction is not found");
        return res.status(404).send({
          message: "error",
          errors: "Transaction is not found",
        });
      }

      res.status(200).send({
        transaksi_send_temp,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error",
        errors: err,
      });
      logger.error("Error : " + err);
    });
}

async function listTransactionOK(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const isijson = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  const agentids = await Agent_id.findOne({
    where: { agent_id: isijson.agentid },
  });
  const isi_detail = req.body.detail.split("-");
  var time = moment.tz(new Date(), "Asia/Jakarta").format("YYYY-MM-DD");
  if (isi_detail[0] === "month") {
    time = moment.tz(new Date(), "Asia/Jakarta").format("YYYY-MM");
  }

  return Transaksi_send.findAll({
    where: {
      corporate: agentids.corporate,
      agent_id: isi_detail[1],
      created_at: {
        [Op.gt]: time,
      },
    },
    order: [["created_at", "DESC"]],
  })
    .then((transaksi_send_temp) => {
      if (!transaksi_send_temp) {
        logger.error("Transaction is not found");
        return res.status(404).send({
          message: "error",
          errors: "Transaction is not found",
        });
      }

      res.status(200).send({
        transaksi_send_temp,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error",
        errors: err,
      });
      logger.error("Error : " + err);
    });
}

async function listTransactionToday(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const isijson = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  const agentids = await Agent_id.findOne({
    where: { agent_id: isijson.agentid },
  });
  return Transaksi_send_temp.findAll({
    where: {
      mgisession: {
        [Op.ne]: "",
      },
      created_at: {
        [Op.gt]: moment
          .tz(req.body.tanggal, "Asia/Jakarta")
          .format("YYYY-MM-DD"),
      },
      corporate: agentids.corporate,
    },
    order: [["created_at", "DESC"]],
  })
    .then((transaksi_send_temp) => {
      if (!transaksi_send_temp) {
        logger.error("Transaction is not found");
        return res.status(404).send({
          message: "error",
          errors: "Transaction is not found",
        });
      }

      res.status(200).send({
        transaksi_send_temp,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error",
        errors: err,
      });
      logger.error("Error : " + err);
    });
}

async function send(req, res) {
  try {
    const url = process.env.SOAP_MG_DEV;
    const token = req.headers.authorization.split(" ")[1];
    const isijson = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    const agentids = await Agent_id.findOne({
      where: { agent_id: isijson.agentid },
    });
    var args = {
      agentID: agentids.agent_id,
      agentSequence: agentids.pos,
      token: agentids.pos_password,
      timeStamp: moment()
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DDTHH:mm:ss+07:00"),
      apiVersion: "1512",
      clientSoftwareVersion: "2",
      channelType: "SYSTEM",
      productType: "SEND",
      amountIncludingFee: req.body.amount,
      receiveCountry: req.body.country,
      allOptions: true,
      promoCodeValues: req.body.promoCodeValues,
    };

    if (req.body.sendtype === "exclude") {
      args = {
        agentID: agentids.agent_id,
        agentSequence: agentids.pos,
        token: agentids.pos_password,
        timeStamp: moment()
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DDTHH:mm:ss+07:00"),
        apiVersion: "1512",
        clientSoftwareVersion: "2",
        channelType: "SYSTEM",
        productType: "SEND",
        amountExcludingFee: req.body.amount,
        receiveCountry: req.body.country,
        allOptions: true,
        promoCodeValues: req.body.promoCodeValues,
      };
    }

    if (req.body.sendtype === "receive_amount") {
      args = {
        agentID: agentids.agent_id,
        agentSequence: agentids.pos,
        token: agentids.pos_password,
        timeStamp: moment()
          .tz("Asia/Jakarta")
          .format("YYYY-MM-DDTHH:mm:ss+07:00"),
        apiVersion: "1512",
        clientSoftwareVersion: "2",
        channelType: "SYSTEM",
        productType: "SEND",
        receiveAmount: req.body.amount,
        receiveCountry: req.body.country,
        allOptions: true,
        promoCodeValues: req.body.promoCodeValues,
      };
    }

    logger.info(args);

    // then/catch
    return soap.createClient(url, {}, function (err, client) {
      client.feeLookup(args, function (err, result) {
        fs.appendFile(
          "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
          "\n\nRequest \n" + formatXml(client.lastRequest),
          function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          }
        );

        // Or
        fs.appendFile(
          "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
          "\n\nResponse \n" + formatXml(client.lastResponse),
          function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          }
        );
        logger.info("Request: \n" + formatXml(client.lastRequest));
        logger.info("Response: \n" + formatXml(client.lastResponse));
        var repl = client.lastResponse.replaceAll("soapenv:", "");
        var repl = repl.replaceAll("ac:", "");

        parseString(repl, function (err, results) {
          if (err) {
            throw {
              Fault: {
                error: {
                  data: {
                    err,
                  }, //Error object from catch
                },
              },
            };
          } else {
            if (results.Envelope.Body[0].Fault != undefined) {
              res.status(200).send({
                status: "error",
                message:
                  results.Envelope.Body[0].Fault[0].detail[0].errors[0]
                    .error[0],
              });
            } else if (
              results.Envelope.Body[0].feeLookupResponse[0].feeInfo[0]
                .promotionInfo != undefined
            ) {
              res.status(200).send({
                status: "error",
                message:
                  results.Envelope.Body[0].feeLookupResponse[0].feeInfo[0]
                    .promotionInfo[0].promotionErrorMessage[0]
                    .textTranslation[0],
              });
            } else if (
              results.Envelope.Body[0].feeLookupResponse != undefined
            ) {
              res.status(200).send({
                status: "success",
                message: results.Envelope.Body[0].feeLookupResponse[0],
              });
            } else {
              res.status(200).send({ status: "error", message: results });
            }
          }
        });
      });
    });
  } catch (error) {
    res.status(500).send({
      message: "error",
      errors: error.toString(),
    });

    logger.error(error);
  }
}

async function sendgfpp(req, res) {
  const url = process.env.SOAP_MG_DEV;
  const token = req.headers.authorization.split(" ")[1];
  const isijson = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  const agentids = await Agent_id.findOne({
    where: { agent_id: isijson.agentid },
  });
  var args = {
    agentID: agentids.agent_id,
    agentSequence: agentids.pos,
    token: agentids.pos_password,
    timeStamp: moment().tz("Asia/Jakarta").format("YYYY-MM-DDTHH:mm:ss+07:00"),
    apiVersion: "1512",
    clientSoftwareVersion: "2",
    channelType: "SYSTEM",
    receiveCountry: req.body.receiveCountry,
    deliveryOption: req.body.deliveryOption,
    thirdPartyType: "NONE",
    receiveCurrency: req.body.receiveCurrency,
    amount: req.body.amount,
    sendCurrency: req.body.sendCurrency,
    productType: "SEND",
    consumerId: 0,
    formFreeStaging: false,
  };

  if (req.body.receiveAgentID != "") {
    var keyValues = Object.entries(args); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
    keyValues.splice(10, 0, ["receiveAgentID", req.body.receiveAgentID]); // insert key value at the index you want like 1.
    args = Object.fromEntries(keyValues);
  }

  logger.info(args);
  try {
    // then/catch
    return soap.createClient(url, {}, function (err, client) {
      client.getFieldsForProduct(args, function (err, result) {
        fs.appendFile(
          "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
          "\n\nRequest \n" + formatXml(client.lastRequest),
          function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          }
        );

        // Or
        fs.appendFile(
          "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
          "\n\nResponse \n" + formatXml(client.lastResponse),
          function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          }
        );
        logger.info("Request:" + formatXml(client.lastRequest));
        logger.info("Response:" + formatXml(client.lastResponse));
        var repl = client.lastResponse.replaceAll("soapenv:", "");
        var repl = repl.replaceAll("ac:", "");

        parseString(repl, function (err, results) {
          if (err) {
            throw {
              Fault: {
                error: {
                  data: {
                    err,
                  }, //Error object from catch
                },
              },
            };
          } else {
            if (results.Envelope.Body[0].Fault != undefined) {
              res.status(200).send({
                status: "error",
                message:
                  results.Envelope.Body[0].Fault[0].detail[0].errors[0]
                    .error[0],
              });
            } else if (
              results.Envelope.Body[0].getFieldsForProductResponse != undefined
            ) {
              res.status(200).send({
                status: "success",
                message:
                  results.Envelope.Body[0].getFieldsForProductResponse[0],
              });
            } else {
              res.status(200).send({ status: "error", message: results });
            }
          }
        });
      });
    });
  } catch (error) {
    res.status(500).send({
      message: "error",
      errors: error,
    });
    logger.error("Error : " + error);
  }
}

async function sendvalidation(req, res) {
  try {
    const url = process.env.SOAP_MG_DEV;
    const token = req.headers.authorization.split(" ")[1];
    const isijson = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    const agentids = await Agent_id.findOne({
      where: { agent_id: isijson.agentid },
    });
    var args = {
      agentID: agentids.agent_id,
      agentSequence: agentids.pos,
      token: agentids.pos_password,
      timeStamp: moment()
        .tz("Asia/Jakarta")
        .format("YYYY-MM-DDTHH:mm:ss+07:00"),
      apiVersion: "1512",
      clientSoftwareVersion: "2",
      channelType: "SYSTEM",
      operatorName: req.body.operatorName,
      amount: req.body.amount,
      destinationCountry: req.body.destinationCountry,
      deliveryOption: req.body.deliveryOption,
      receiveCurrency: req.body.receiveCurrency,
      senderFirstName: req.body.senderFirstName,
      senderLastName: req.body.senderLastName,
      senderAddress: req.body.senderAddress,
      senderCity: req.body.senderCity,
      senderState: req.body.senderState,
      senderZipCode: req.body.senderZipCode,
      senderCountry: req.body.senderCountry,
      senderHomePhone: req.body.senderHomePhone,
      senderMailingAddress: req.body.senderMailingAddress,
      senderMailingCity: req.body.senderMailingCity,
      senderMailingState: req.body.senderMailingState,
      senderMailingZipCode: req.body.senderMailingZipCode,
      senderMailingCountry: req.body.senderMailingCountry,
      receiverFirstName: req.body.receiverFirstName,
      receiverLastName: req.body.receiverLastName,

      receiverPhone: req.body.receiverPhone,
      receiverPhoneCountryCode: req.body.receiverPhoneCountryCode,
      senderPhotoIdType: req.body.senderPhotoIdType,
      senderPhotoIdNumber: req.body.senderPhotoIdNumber,
      senderPhotoIdState: req.body.senderPhotoIdState,
      senderPhotoIdCountry: req.body.senderPhotoIdCountry,
      senderDOB: req.body.senderDOB,
      senderOccupation: req.body.senderOccupation,
      senderBirthCity: req.body.senderBirthCity,
      senderBirthCountry: req.body.senderBirthCountry,
      sendCurrency: req.body.sendCurrency,
      consumerId: 0,
      senderNationalityCountry: req.body.senderNationalityCountry,
      mgiTransactionSessionID: req.body.mgiTransactionSessionID,
      formFreeStaging: false,
      sendPurposeOfTransaction: req.body.sendPurposeOfTransaction,
      sourceOfFunds: req.body.sourceOfFunds,
      relationshipToReceiver: req.body.relationshipToReceiver,
      senderGender: req.body.senderGender,
      senderCitizenshipCountry: req.body.senderCitizenshipCountry,
      senderTransactionEmailNotificationOptIn:
        req.body.senderTransactionEmailNotificationOptIn,
      senderTransactionSMSNotificationOptIn:
        req.body.senderTransactionSMSNotificationOptIn,
      senderMarketingEmailNotificationOptIn:
        req.body.senderMarketingEmailNotificationOptIn,
      senderMarketingSMSNotificationOptIn:
        req.body.senderMarketingSMSNotificationOptIn,
      senderHomePhoneCountryCode: req.body.senderHomePhoneCountryCode,
      senderIntendedUseOfMGIServices: req.body.senderIntendedUseOfMGIServices,
    };
    if (req.body.fieldValues != "") {
      args["fieldValues"] = {};
      var params = [];
      var i = 0;

      for (const element of req.body.fieldValues) {
        var field = element.split("-");
        params[i] = {
          xmlTag: field[0],
          fieldValue: field[1],
        };
        console.log(params);

        console.log(element);
        i++;
      }
      args["fieldValues"]["keyValuePair"] = params;
    }
    if (req.body.receiveAgentID != "") {
      var result = Object.keys(args).map((key) => [key, args[key]]);
      var keyValues = Object.entries(args); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
      var index = result.findIndex((x) => x.includes("receiveCurrency"));
      keyValues.splice(parseFloat(index) + 1, 0, [
        "receiveAgentID",
        req.body.receiveAgentID,
      ]); // insert key value at the index you want like 1.
      args = Object.fromEntries(keyValues);
    }

    if (req.body.accountNumber != "") {
      var result = Object.keys(args).map((key) => [key, args[key]]);
      var keyValues = Object.entries(args); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
      var index = result.findIndex((x) => x.includes("senderFirstName"));
      keyValues.splice(parseFloat(index), 0, [
        "accountNumber",
        req.body.accountNumber,
      ]); // insert key value at the index you want like 1.
      args = Object.fromEntries(keyValues);
    }
    if (req.body.receiverAddress != "") {
      var result = Object.keys(args).map((key) => [key, args[key]]);
      var keyValues = Object.entries(args); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
      var index = result.findIndex((x) => x.includes("receiverLastName"));
      keyValues.splice(parseFloat(index) + 1, 0, [
        "receiverAddress",
        req.body.receiverAddress,
      ]); // insert key value at the index you want like 1.
      args = Object.fromEntries(keyValues);
    }
    if (req.body.receiverCity != "") {
      var result = Object.keys(args).map((key) => [key, args[key]]);
      var keyValues = Object.entries(args); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
      var index = result.findIndex((x) => x.includes("receiverAddress"));
      keyValues.splice(parseFloat(index) + 1, 0, [
        "receiverCity",
        req.body.receiverCity,
      ]); // insert key value at the index you want like 1.
      args = Object.fromEntries(keyValues);
    }
    if (req.body.receiverCountry != "") {
      var result = Object.keys(args).map((key) => [key, args[key]]);
      var keyValues = Object.entries(args); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
      var index = result.findIndex((x) => x.includes("receiverCity"));
      keyValues.splice(parseFloat(index) + 1, 0, [
        "receiverCountry",
        req.body.receiverCountry,
      ]); // insert key value at the index you want like 1.
      args = Object.fromEntries(keyValues);
    }
    if (req.body.receiverZipCode != "") {
      var result = Object.keys(args).map((key) => [key, args[key]]);
      var keyValues = Object.entries(args); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
      var index = result.findIndex((x) => x.includes("receiverCountry"));
      keyValues.splice(parseFloat(index), 0, [
        "receiverZipCode",
        req.body.receiverZipCode,
      ]); // insert key value at the index you want like 1.
      args = Object.fromEntries(keyValues);
      // args["receiverZipCode"]=req.body.receiverZipCode;
    }
    if (req.body.senderMiddleName != "") {
      var result = Object.keys(args).map((key) => [key, args[key]]);
      var keyValues = Object.entries(args); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
      var index = result.findIndex((x) => x.includes("senderFirstName"));
      keyValues.splice(parseFloat(index) + 1, 0, [
        "senderMiddleName",
        req.body.senderMiddleName,
      ]); // insert key value at the index you want like 1.
      args = Object.fromEntries(keyValues);
    }
    if (req.body.senderLastName2 != "") {
      var result = Object.keys(args).map((key) => [key, args[key]]);
      var keyValues = Object.entries(args); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
      var index = result.findIndex((x) => x.includes("senderLastName"));
      keyValues.splice(parseFloat(index) + 1, 0, [
        "senderLastName2",
        req.body.senderLastName2,
      ]); // insert key value at the index you want like 1.
      args = Object.fromEntries(keyValues);
    }

    if (req.body.receiverMiddleName != "") {
      var result = Object.keys(args).map((key) => [key, args[key]]);
      var keyValues = Object.entries(args); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
      var index = result.findIndex((x) => x.includes("receiverFirstName"));
      keyValues.splice(parseFloat(index) + 1, 0, [
        "receiverMiddleName",
        req.body.receiverMiddleName,
      ]); // insert key value at the index you want like 1.
      args = Object.fromEntries(keyValues);
    }

    if (req.body.receiverLastName2 != "") {
      var result = Object.keys(args).map((key) => [key, args[key]]);
      var keyValues = Object.entries(args); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
      var index = result.findIndex((x) => x.includes("receiverLastName"));
      keyValues.splice(parseFloat(index) + 1, 0, [
        "receiverLastName2",
        req.body.receiverLastName2,
      ]); // insert key value at the index you want like 1.
      args = Object.fromEntries(keyValues);
    }
    logger.info(args);

    // then/catch
    return soap.createClient(url, {}, function (err, client) {
      client.sendValidation(args, function (err, result) {
        fs.appendFile(
          "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
          "\n\nRequest \n" + formatXml(client.lastRequest),
          function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          }
        );

        // Or
        fs.appendFile(
          "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
          "\n\nResponse \n" + formatXml(client.lastResponse),
          function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          }
        );
        logger.info("Request:" + formatXml(client.lastRequest));
        logger.info("Response:" + formatXml(client.lastResponse));
        var repl = client.lastResponse.replaceAll("soapenv:", "");
        var repl = repl.replaceAll("ac:", "");

        parseString(repl, async function (err, results) {
          if (err) {
            throw {
              Fault: {
                error: {
                  data: {
                    err,
                  }, //Error object from catch
                },
              },
            };
          } else {
            if (results.Envelope.Body[0].Fault != undefined) {
              res.status(200).send({
                status: "error",
                message:
                  results.Envelope.Body[0].Fault[0].detail[0].errors[0]
                    .error[0],
              });
            } else if (
              results.Envelope.Body[0].sendValidationResponse != undefined
            ) {
              console.log(
                results.Envelope.Body[0].sendValidationResponse[0]
                  .displayAccountID
              );
              console.log(
                results.Envelope.Body[0].sendValidationResponse[0]
                  .receiveAmounts[0].payoutCurrency
              );
              const accid =
                results.Envelope.Body[0].sendValidationResponse[0]
                  .displayAccountID === undefined
                  ? ""
                  : results.Envelope.Body[0].sendValidationResponse[0]
                      .displayAccountID[0];
              console.log(accid);
              Transaksi_send_temp.findOne({
                where: {
                  mgisession: req.body.mgiTransactionSessionID,
                },
              })
                .then(async (transaksi_send_temp) => {
                  if (!transaksi_send_temp) {
                    var sendermiddlename = " ";
                    if (req.body.senderMiddleName) {
                      sendermiddlename = " " + req.body.senderMiddleName + " ";
                    }
                    var senderlastname2 = " ";
                    if (req.body.senderLastName2) {
                      senderlastname2 = " " + req.body.senderLastName2;
                    }
                    var receivermiddlename = " ";
                    if (req.body.receiverMiddleName) {
                      receivermiddlename =
                        " " + req.body.receiverMiddleName + " ";
                    }

                    var receiverlastname2 = " ";
                    if (req.body.receiverLastName2) {
                      receiverlastname2 = " " + req.body.receiverLastName2;
                    }
                    const jane = Transaksi_send_temp.create({
                      nama_pengirim:
                        req.body.senderFirstName +
                        sendermiddlename +
                        req.body.senderLastName +
                        senderlastname2,
                      nama_penerima:
                        req.body.receiverFirstName +
                        receivermiddlename +
                        req.body.receiverLastName +
                        receiverlastname2,
                      negara_penerima: req.body.destinationCountry,
                      mgisession: req.body.mgiTransactionSessionID,
                      negara_pengirim: "INDONESIA",
                      no_referensi: "",
                      identitas: req.body.senderPhotoIdType,
                      nomor_identitas: req.body.senderPhotoIdNumber,
                      tanggal_lahir: req.body.senderDOB,
                      alamat_penerima: req.body.receiverAddress,
                      telepon_penerima: req.body.receiverPhone,
                      kota_penerima: req.body.receiverCity,
                      pekerjaan: req.body.senderOccupation,
                      tujuan_penggunaan_dana: req.body.sendPurposeOfTransaction,
                      id_pos: agentids.agent_id,
                      corporate: agentids.corporate,
                      total_collect_amount: req.body.totalAmountToCollect,
                      hubungan_pengirim: req.body.relationshipToReceiver,
                      kota_lahir_pengirim: req.body.senderBirthCity,
                      tanggal: new Date().toISOString("en-ID", {
                        timeZone: "Asia/Jakarta",
                      }),
                      deltawork: "",
                      deltawork708: "",
                      provinsi: req.body.senderState,
                      mgisession: req.body.mgiTransactionSessionID,
                      sumber_dana: req.body.sourceOfFunds,
                      tempat_lahir: req.body.senderBirthCity,
                      kode_pos: req.body.senderZipCode,
                      jenis_kelamin: req.body.senderGender,
                      amount: req.body.amount,
                      pesan: "",
                      timestamp: req.body.timestamp,
                      negara_penerima: req.body.destinationCountry,
                      photoidcountry: req.body.senderPhotoIdCountry,
                      photoidstate: req.body.senderPhotoIdState,
                      arsema_validation: "",
                      status_cta: 2,
                      receive_amount: req.body.receiveAmount,
                      currency: req.body.receiveCurrency,
                      foto_id: "",
                      telpon_pengirim: req.body.senderHomePhone,
                      tanggal_transaksi: "",
                      alamat_pengirim: req.body.senderAddress,
                      kota_pengirim: req.body.senderCity,
                      provinsi_pengirim: req.body.senderState,
                      kode_pos_pengirim: req.body.senderZipCode,
                      opt_display: req.body.opt_display,
                      payout_currency:
                        results.Envelope.Body[0].sendValidationResponse[0]
                          .receiveAmounts[0].payoutCurrency[0],
                      receive_agent_abb: req.body.receiveAgentID,
                      receive_fee: req.body.receiveFee,
                      receive_tax: req.body.receiveTax,
                      total_receive_amount: req.body.total_receive_amount,
                      exchange_rate: req.body.exchange_rate,
                      sending_fee: req.body.sending_fee,
                      kode_promosi: req.body.promoCodeValues,
                      consumer_text: "",
                      expected_date: "",
                      disclosure_text: "",
                      dial: "",
                      pin: "",
                      receive_abb_name: req.body.receive_abb_name,
                      alamat_domisili_pengirim: req.body.senderMailingAddress,
                      kota_domisili_pengirim: req.body.senderMailingCity,
                      kode_pos_domisili_pengirim: req.body.senderMailingZipCode,
                      provinsi_domisili_pengirim: req.body.senderMailingState,
                      negara_domisili_pengirim: req.body.senderMailingCountry,
                      account_id: accid,
                      created_at: moment()
                        .tz("Asia/Jakarta")
                        .format("YYYY-MM-DDTHH:mm:ss+07:00"),
                      updated_at: moment()
                        .tz("Asia/Jakarta")
                        .format("YYYY-MM-DDTHH:mm:ss+07:00"),
                      field_values: JSON.stringify(req.body.fieldValues),
                      maker: isijson.email,
                      agent_id: agentids.agent_id,
                    });
                    if (jane.id) {
                      logger.info(
                        "Insert db success: " + req.body.mgiTransactionSessionID
                      );
                    }
                  } else {
                    var sendermiddlename = "";
                    if (req.body.senderMiddleName) {
                      sendermiddlename = req.body.senderMiddleName + " ";
                    }
                    var senderlastname2 = "";
                    if (req.body.senderLastName2) {
                      senderlastname2 = " " + req.body.senderLastName2;
                    }
                    var receivermiddlename = "";
                    if (req.body.receiverMiddleName) {
                      receivermiddlename = req.body.receiverMiddleName + " ";
                    }

                    var receiverlastname2 = "";
                    if (req.body.receiverLastName2) {
                      receiverlastname2 = " " + req.body.receiverLastName2;
                    }
                    Transaksi_send_temp.update(
                      {
                        nama_pengirim:
                          req.body.senderFirstName +
                          " " +
                          sendermiddlename +
                          req.body.senderLastName +
                          senderlastname2,
                        nama_penerima:
                          req.body.receiverFirstName +
                          " " +
                          receivermiddlename +
                          " " +
                          req.body.receiverLastName +
                          receiverlastname2,
                        negara_penerima: req.body.destinationCountry,
                        mgisession: req.body.mgiTransactionSessionID,
                        negara_pengirim: "INDONESIA",
                        no_referensi: "",
                        identitas: req.body.senderPhotoIdType,
                        nomor_identitas: req.body.senderPhotoIdNumber,
                        tanggal_lahir: req.body.senderDOB,
                        alamat_penerima: req.body.receiverAddress,
                        telepon_penerima: req.body.receiverPhone,
                        kota_penerima: req.body.receiverCity,
                        pekerjaan: req.body.senderOccupation,
                        kota_lahir_pengirim: req.body.senderBirthCity,
                        hubungan_pengirim: req.body.relationshipToReceiver,
                        tujuan_penggunaan_dana:
                          req.body.sendPurposeOfTransaction,
                        id_pos: agentids.agent_id,
                        corporate: agentids.corporate,
                        tanggal: new Date().toISOString("en-ID", {
                          timeZone: "Asia/Jakarta",
                        }),
                        deltawork: "",
                        deltawork708: "",
                        provinsi: req.body.senderState,
                        mgisession: req.body.mgiTransactionSessionID,
                        sumber_dana: req.body.sourceOfFunds,
                        tempat_lahir: req.body.senderBirthCity,
                        kode_pos: req.body.senderZipCode,
                        jenis_kelamin: req.body.senderGender,
                        amount: req.body.amount,
                        pesan: "",
                        timestamp: req.body.timestamp,
                        negara_penerima: req.body.destinationCountry,
                        photoidcountry: req.body.senderPhotoIdCountry,
                        photoidstate: req.body.senderPhotoIdState,
                        arsema_validation: "",
                        status_cta: "2",
                        receive_amount: req.body.receiveAmount,
                        currency: req.body.receiveCurrency,
                        foto_id: "",
                        telpon_pengirim: req.body.senderHomePhone,
                        tanggal_transaksi: "",
                        alamat_pengirim: req.body.senderAddress,
                        kota_pengirim: req.body.senderCity,
                        provinsi_pengirim: req.body.senderState,
                        kode_pos_pengirim: req.body.senderZipCode,
                        opt_display: req.body.opt_display,
                        payout_currency: req.body.payout_currency,
                        receive_agent_abb: req.body.receiveAgentID,
                        receive_fee: req.body.receiveFee,
                        receive_tax: req.body.receiveTax,
                        total_receive_amount: req.body.total_receive_amount,
                        exchange_rate: req.body.exchange_rate,
                        sending_fee: req.body.sending_fee,
                        kode_promosi: req.body.promoCodeValues,
                        consumer_text: "",
                        expected_date: "",
                        disclosure_text: "",
                        dial: "",
                        pin: "",
                        receive_abb_name: req.body.receive_abb_name,
                        alamat_domisili_pengirim: req.body.senderMailingAddress,
                        kota_domisili_pengirim: req.body.senderMailingCity,
                        kode_pos_domisili_pengirim:
                          req.body.senderMailingZipCode,
                        provinsi_domisili_pengirim: req.body.senderMailingState,
                        negara_domisili_pengirim: req.body.senderMailingCountry,
                        account_id: "",

                        updated_at: moment
                          .tz(new Date(), "Asia/Jakarta")
                          .format(),
                        field_values: JSON.stringify(req.body.fieldValues),
                      },
                      {
                        where: {
                          mgisession: req.body.mgiTransactionSessionID,
                        },
                      }
                    );
                    logger.info(
                      "update db success: " + req.body.mgiTransactionSessionID
                    );
                  }
                  User.findAll({
                    raw: true,
                    where: {
                      corporate: agentids.corporate,
                    },
                    order: [["email", "ASC"]],
                  }).then((roles) => {
                    roles.map(async (activity) => {
                      const rolesa = await Roles.findOne({
                        where: { email: activity.email, name: "approver" },
                      });

                      if (rolesa !== null) {
                        const mailData = {
                          from: "no-reply@arsema.co.id", // sender address
                          to: rolesa.email, // list of receivers
                          subject:
                            "New transaction is coming. Please check and approve this transaction",
                          text: "",
                          html: `<b>Hi! </b><br> Please check and approve latest send transaction below:<br/><br/>
                                            <table style="width:75%;" cellpadding=10>
                                                <tr><td>Sender:</td><td>${
                                                  req.body.senderFirstName +
                                                  " " +
                                                  sendermiddlename +
                                                  req.body.senderLastName +
                                                  senderlastname2
                                                }</td></tr>
                                                <tr><td>Receiver:</td><td>${
                                                  req.body.receiverFirstName +
                                                  " " +
                                                  receivermiddlename +
                                                  req.body.receiverLastName +
                                                  receiverlastname2
                                                }</td></tr>
                                                <tr><td>Amount:</td><td>${
                                                  req.body.amount
                                                }</td></tr>
                                                <tr><td>Destination Country:</td><td>${
                                                  req.body.destinationCountry
                                                }</td></tr>
                                            </table>
                                      <br/><br/>
                                              <b>Thank you</b>`,
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
                            logger.error("Error : " + error);
                            return false;
                          }
                          logger.info("Response:" + error);
                          res.status(200).send({
                            message: "success",
                          });
                          return true;
                        });
                      }
                    });
                  });
                })
                .catch((err) => {
                  logger.error("Error : " + err);
                });

              res.status(200).send({
                status: "success",
                message: results.Envelope.Body[0].sendValidationResponse[0],
              });
            } else {
              res.status(200).send({ status: "error", message: results });
            }
          }
        });
      });
    });
  } catch (error) {
    res.status(500).send({
      message: "error",
      errors: error,
    });
    logger.error("Error : " + error);
  }
}

async function sendcommit(req, res) {
  const url = process.env.SOAP_MG_DEV;
  const token = req.headers.authorization.split(" ")[1];
  const isijson = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  const agentidsa = await Agent_id.findOne({
    where: { agent_id: isijson.agentid },
  });

  Transaksi_send_temp.findOne({
    where: {
      mgisession: req.body.mgiTransactionSessionID,
    },
  }).then(async (transaksi_send_temp) => {
    if (!transaksi_send_temp) {
      res
        .status(200)
        .send({ status: "error", message: "Transaction is not allowed" });
    } else if (transaksi_send_temp.status_cta == 2) {
      try {
        // then/catch
        const agentids = await Agent_id.findOne({
          where: {
            agent_id: transaksi_send_temp.id_pos,
            corporate: agentidsa.corporate,
          },
        });

        var args = {
          agentID: agentids.agent_id,
          agentSequence: agentids.pos,
          token: agentids.pos_password,
          timeStamp: moment()
            .tz("Asia/Jakarta")
            .format("YYYY-MM-DDTHH:mm:ss+07:00"),
          apiVersion: "1512",
          clientSoftwareVersion: "2",
          channelType: "SYSTEM",
          mgiTransactionSessionID: req.body.mgiTransactionSessionID,
          productType: "SEND",
        };
        logger.info(args);
        return soap.createClient(url, {}, function (err, client) {
          client.commitTransaction(args, function (err, result) {
            fs.appendFile(
              "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
              "\n\nRequest \n" + formatXml(client.lastRequest),
              function (err) {
                if (err) {
                  return console.log(err);
                }
                console.log("The file was saved!");
              }
            );

            // Or
            fs.appendFile(
              "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
              "\n\nResponse \n" + formatXml(client.lastResponse),
              function (err) {
                if (err) {
                  return console.log(err);
                }
                console.log("The file was saved!");
              }
            );
            logger.info("Request:" + formatXml(client.lastRequest));
            logger.info("Response:" + formatXml(client.lastResponse));
            var repl = client.lastResponse.replaceAll("soapenv:", "");
            var repl = repl.replaceAll("ac:", "");

            parseString(repl, function (err, results) {
              if (err) {
                throw {
                  Fault: {
                    error: {
                      data: {
                        err,
                      }, //Error object from catch
                    },
                  },
                };
              } else {
                if (results.Envelope.Body[0].Fault != undefined) {
                  res.status(200).send({
                    status: "error",
                    message:
                      results.Envelope.Body[0].Fault[0].detail[0].errors[0]
                        .error[0],
                  });
                } else if (
                  results.Envelope.Body[0].commitTransactionResponse !=
                  undefined
                ) {
                  res.status(200).send({
                    status: "success",
                    message:
                      results.Envelope.Body[0].commitTransactionResponse[0],
                  });
                  Transaksi_send.count({
                    where: {
                      mgisession: req.body.mgiTransactionSessionID,
                    },
                  }).then((result) => {
                    if (result != 0) {
                      jane = Transaksi_send.update(
                        {
                          nama_pengirim: transaksi_send_temp.nama_pengirim,
                          nama_penerima: transaksi_send_temp.nama_penerima,
                          negara_penerima: transaksi_send_temp.negara_penerima,
                          negara_pengirim: "INDONESIA",
                          no_referensi:
                            results.Envelope.Body[0]
                              .commitTransactionResponse[0].referenceNumber[0],
                          identitas: transaksi_send_temp.identitas,
                          nomor_identitas: transaksi_send_temp.nomor_identitas,
                          tanggal_lahir: transaksi_send_temp.tanggal_lahir,
                          alamat_penerima: transaksi_send_temp.alamat_penerima,
                          telepon_penerima:
                            transaksi_send_temp.telepon_penerima,
                          kota_penerima: transaksi_send_temp.kota_penerima,
                          pekerjaan: transaksi_send_temp.pekerjaan,
                          tujuan_penggunaan_dana:
                            transaksi_send_temp.tujuan_penggunaan_dana,
                          id_pos: transaksi_send_temp.id_pos,
                          corporate: transaksi_send_temp.corporate,
                          total_collect_amount:
                            transaksi_send_temp.total_collect_amount,
                          expected_date:
                            results.Envelope.Body[0]
                              .commitTransactionResponse[0]
                              .expectedDateOfDelivery[0],
                          tanggal: new Date().toISOString("en-ID", {
                            timeZone: "Asia/Jakarta",
                          }),
                          deltawork: "",
                          deltawork708: "",
                          provinsi: transaksi_send_temp.provinsi,
                          mgisession: transaksi_send_temp.mgisession,
                          sumber_dana: transaksi_send_temp.sumber_dana,
                          tempat_lahir: transaksi_send_temp.tempat_lahir,
                          kode_pos: transaksi_send_temp.kode_pos,
                          jenis_kelamin: transaksi_send_temp.jenis_kelamin,
                          amount: transaksi_send_temp.amount,
                          pesan: "",
                          timestamp: transaksi_send_temp.timestamp,
                          negara_penerima: transaksi_send_temp.negara_penerima,
                          photoidcountry: transaksi_send_temp.photoidcountry,
                          photoidstate: transaksi_send_temp.photoidstate,
                          arsema_validation: "",
                          status_cta: 1,
                          receive_amount: transaksi_send_temp.receive_amount,
                          currency: transaksi_send_temp.currency,
                          foto_id: "",
                          telpon_pengirim: transaksi_send_temp.telpon_pengirim,
                          tanggal_transaksi: "",
                          alamat_pengirim: transaksi_send_temp.alamat_pengirim,
                          kota_pengirim: transaksi_send_temp.kota_pengirim,
                          provinsi_pengirim:
                            transaksi_send_temp.provinsi_pengirim,
                          kode_pos_pengirim:
                            transaksi_send_temp.kode_pos_pengirim,
                          opt_display: transaksi_send_temp.opt_display,
                          payout_currency: transaksi_send_temp.payout_currency,
                          receive_agent_abb:
                            transaksi_send_temp.receive_agent_abb,
                          receive_fee: transaksi_send_temp.receive_fee,
                          receive_tax: transaksi_send_temp.receive_tax,
                          total_receive_amount:
                            transaksi_send_temp.total_receive_amount,
                          exchange_rate: transaksi_send_temp.exchange_rate,
                          sending_fee: transaksi_send_temp.sending_fee,
                          kode_promosi: transaksi_send_temp.kode_promosi,
                          consumer_text: "",
                          disclosure_text: "",
                          dial: "",
                          pin: "",
                          receive_abb_name:
                            transaksi_send_temp.receive_abb_name,
                          alamat_domisili_pengirim:
                            transaksi_send_temp.alamat_domisili_pengirim,
                          kota_domisili_pengirim:
                            transaksi_send_temp.kota_domisili_pengirim,
                          kode_pos_domisili_pengirim:
                            transaksi_send_temp.kode_pos_domisili_pengirim,
                          provinsi_domisili_pengirim:
                            transaksi_send_temp.provinsi_domisili_pengirim,
                          negara_domisili_pengirim:
                            transaksi_send_temp.negara_domisili_pengirim,
                          account_id: "",
                          updated_at: new Date().toISOString("en-ID", {
                            timeZone: "Asia/Jakarta",
                          }),
                        },
                        {
                          where: {
                            mgisession: req.body.mgiTransactionSessionID,
                          },
                        }
                      );

                      Transaksi_send_temp.update(
                        {
                          status_cta: 3,
                        },
                        {
                          where: {
                            mgisession: req.body.mgiTransactionSessionID,
                          },
                        }
                      );

                      const mailData = {
                        from: "no-reply@arsema.co.id", // sender address
                        to: isijson.email, // list of receivers
                        subject: "New transaction already approved",
                        text: "",
                        html: `<b>Hi! </b><br> This send transaction was Approved:<br/><br/>
                                                                                    <table style="width:75%;" cellpadding=10>
                                                                                        <tr><td width=200>Sender:</td><td>${transaksi_send_temp.nama_pengirim}</td></tr>
                                                                                        <tr><td>Receiver:</td><td>${transaksi_send_temp.nama_penerima}</td></tr>
                                                                                        <tr><td>Amount:</td><td>${transaksi_send_temp.currency} ${transaksi_send_temp.amount}</td></tr>
                                                                                        <tr><td>Destination Country:</td><td>${transaksi_send_temp.negara_penerima}</td></tr>
                                                                                    </table>
                                                                              <br/><br/>
                                                                                      <b>Thank you</b>`,
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
                          logger.error("Error : " + error);
                          return false;
                        }
                        logger.info("Response:" + error);
                        res.status(200).send({
                          message: "success",
                        });
                        return true;
                      });
                      return false;
                    } else {
                      Transaksi_send_temp.findOne({
                        where: {
                          mgisession: req.body.mgiTransactionSessionID,
                        },
                      }).then((transaksi_send_temp) => {
                        const mailData = {
                          from: "no-reply@arsema.co.id", // sender address
                          to: isijson.email, // list of receivers
                          subject: "New transaction already approved",
                          text: "",
                          html: `<b>Hi! </b><br> transaction below was approved:<br/><br/>
                                                                                <table style="width:75%;" cellpadding=10>
                                                                                    <tr><td width=200>Sender:</td><td>${transaksi_send_temp.nama_pengirim}</td></tr>
                                                                                    <tr><td>Receiver:</td><td>${transaksi_send_temp.nama_penerima}</td></tr>
                                                                                    <tr><td>Amount:</td><td>${transaksi_send_temp.currency} ${transaksi_send_temp.amount}</td></tr>
                                                                                    <tr><td>Destination Country:</td><td>${transaksi_send_temp.negara_penerima}</td></tr>
                                                                                </table>
                                                                          <br/><br/>
                                                                                  <b>Thank you</b>`,
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
                            logger.error("Error : " + error);
                            return false;
                          }
                          logger.info("Response:" + error);
                          res.status(200).send({
                            message: "success",
                          });
                          return true;
                        });
                        const jane = Transaksi_send.create({
                          id_transaksi: moment
                            .tz(new Date(), "Asia/Jakarta")
                            .format("YYYYMMDDHHmmss"),
                          nama_pengirim: transaksi_send_temp.nama_pengirim,
                          nama_penerima: transaksi_send_temp.nama_penerima,
                          negara_penerima: transaksi_send_temp.negara_penerima,
                          negara_pengirim: "INDONESIA",
                          no_referensi:
                            results.Envelope.Body[0]
                              .commitTransactionResponse[0].referenceNumber[0],
                          identitas: transaksi_send_temp.identitas,
                          nomor_identitas: transaksi_send_temp.nomor_identitas,
                          hubungan_pengirim:
                            transaksi_send_temp.hubungan_pengirim,
                          kota_lahir_pengirim:
                            transaksi_send_temp.kota_lahir_pengirim,
                          tanggal_lahir: transaksi_send_temp.tanggal_lahir,
                          alamat_penerima: transaksi_send_temp.alamat_penerima,
                          telepon_penerima:
                            transaksi_send_temp.telepon_penerima,
                          kota_penerima: transaksi_send_temp.kota_penerima,
                          pekerjaan: transaksi_send_temp.pekerjaan,
                          tujuan_penggunaan_dana:
                            transaksi_send_temp.tujuan_penggunaan_dana,
                          id_pos: transaksi_send_temp.id_pos,
                          agent_id: transaksi_send_temp.agent_id,
                          corporate: transaksi_send_temp.corporate,
                          field_values: transaksi_send_temp.field_values,
                          receive_amount: transaksi_send_temp.receive_amount,
                          total_collect_amount:
                            transaksi_send_temp.total_collect_amount,
                          expected_date:
                            results.Envelope.Body[0]
                              .commitTransactionResponse[0]
                              .expectedDateOfDelivery[0],
                          tanggal: new Date().toISOString("en-ID", {
                            timeZone: "Asia/Jakarta",
                          }),
                          deltawork: "",
                          deltawork708: "",
                          provinsi: transaksi_send_temp.provinsi,
                          mgisession: transaksi_send_temp.mgisession,
                          sumber_dana: transaksi_send_temp.sumber_dana,
                          tempat_lahir: transaksi_send_temp.tempat_lahir,
                          kode_pos: transaksi_send_temp.kode_pos,
                          jenis_kelamin: transaksi_send_temp.jenis_kelamin,
                          amount: transaksi_send_temp.amount,
                          pesan: "",
                          timestamp: transaksi_send_temp.timestamp,
                          negara_penerima: transaksi_send_temp.negara_penerima,
                          photoidcountry: transaksi_send_temp.photoidcountry,
                          photoidstate: transaksi_send_temp.photoidstate,
                          arsema_validation: "",
                          status_cta: 1,
                          receive_amount: transaksi_send_temp.receive_amount,
                          currency: transaksi_send_temp.currency,
                          foto_id: "",
                          telpon_pengirim: transaksi_send_temp.telpon_pengirim,
                          tanggal_transaksi: "",
                          alamat_pengirim: transaksi_send_temp.alamat_pengirim,
                          kota_pengirim: transaksi_send_temp.kota_pengirim,
                          provinsi_pengirim:
                            transaksi_send_temp.provinsi_pengirim,
                          kode_pos_pengirim:
                            transaksi_send_temp.kode_pos_pengirim,
                          opt_display: transaksi_send_temp.opt_display,
                          payout_currency: transaksi_send_temp.payout_currency,
                          receive_agent_abb:
                            transaksi_send_temp.receive_agent_abb,
                          receive_fee: transaksi_send_temp.receive_fee,
                          receive_tax: transaksi_send_temp.receive_tax,
                          total_receive_amount:
                            transaksi_send_temp.total_receive_amount,
                          exchange_rate: transaksi_send_temp.exchange_rate,
                          sending_fee: transaksi_send_temp.sending_fee,
                          kode_promosi: transaksi_send_temp.kode_promosi,
                          consumer_text: "",
                          disclosure_text: "",
                          dial: "",
                          pin: "",
                          receive_abb_name:
                            transaksi_send_temp.receive_abb_name,
                          alamat_domisili_pengirim:
                            transaksi_send_temp.alamat_domisili_pengirim,
                          kota_domisili_pengirim:
                            transaksi_send_temp.kota_domisili_pengirim,
                          kode_pos_domisili_pengirim:
                            transaksi_send_temp.kode_pos_domisili_pengirim,
                          provinsi_domisili_pengirim:
                            transaksi_send_temp.provinsi_domisili_pengirim,
                          negara_domisili_pengirim:
                            transaksi_send_temp.negara_domisili_pengirim,
                          account_id: transaksi_send_temp.account_id,
                          created_at: new Date().toISOString("en-ID", {
                            timeZone: "Asia/Jakarta",
                          }),
                          updated_at: new Date().toISOString("en-ID", {
                            timeZone: "Asia/Jakarta",
                          }),
                          approver: isijson.email,
                          maker: transaksi_send_temp.maker,
                          agent_id: transaksi_send_temp.agent_id,
                        });

                        logger.info(
                          "Insert db success: " +
                            req.body.mgiTransactionSessionID
                        );
                        Transaksi_send_temp.update(
                          {
                            status_cta: 3,
                            approver: isijson.email,
                          },
                          {
                            where: {
                              mgisession: req.body.mgiTransactionSessionID,
                            },
                          }
                        );
                      });
                    }
                  });
                } else {
                  res.status(200).send({ status: "error", message: results });
                }
              }
            });
          });
        });
      } catch (error) {
        res.status(500).send({
          message: "error",
          errors: error,
        });
        logger.error("Error : " + error);
      }
    } else {
      res.status(200).send({
        status: "error",
        message: "Transaction has not been approved",
      });
    }
  });
}

async function sendcheck(req, res) {
  const url = process.env.SOAP_MG_DEV;
  var args = {
    mgisession: req.body.id,
  };
  logger.info(args);
  Transaksi_send_temp.findOne({
    where: {
      mgisession: req.body.id,
    },
  }).then((transaksi_send_temp) => {
    if (!transaksi_send_temp) {
      res
        .status(200)
        .send({ status: "error", message: "Transaction is not allowed" });
    } else if (transaksi_send_temp.status_cta == "1") {
      try {
        // then/catch
        Transaksi_send_temp.update(
          {
            status_cta: "2",
            updated_at: new Date().toISOString("en-ID", {
              timeZone: "Asia/Jakarta",
            }),
          },
          {
            where: {
              mgisession: req.body.id,
            },
          }
        );
        logger.info("update db success: " + req.body.id);
        Roles.findAll({
          raw: true,
          where: {
            name: "approver",
          },
          order: [["email", "ASC"]],
        }).then((roles) => {
          roles.map((activity) => {
            const mailData = {
              from: "no-reply@arsema.co.id", // sender address
              to: activity.email, // list of receivers
              subject:
                "New transaction is coming. Please approve this transaction",
              text: "",
              html: "<b>Hai! </b><br><br> Please approve latest transaction <br/><br><b>Thank you</b>",
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
                logger.error("Error : " + error);
                return false;
              }
              logger.info("Response:" + error);
              return true;
            });
          });
        });

        res
          .status(200)
          .send({ status: "success", message: "Transaction has been checked" });
      } catch (error) {
        res.status(500).send({
          message: "error",
          errors: error,
        });
        logger.error("Error : " + error);
      }
    } else {
      res.status(200).send({
        status: "error",
        message: "Transaction has not been approved",
      });
    }
  });
}

async function sendreject(req, res) {
  const url = process.env.SOAP_MG_DEV;
  var args = {
    mgisession: req.body.id,
  };
  logger.info(args);
  Transaksi_send_temp.findOne({
    where: {
      mgisession: req.body.id,
    },
  }).then((transaksi_send_temp) => {
    if (!transaksi_send_temp) {
      res
        .status(200)
        .send({ status: "error", message: "Transaction is not allowed" });
    } else if (transaksi_send_temp.status_cta == "2") {
      try {
        // then/catch
        Transaksi_send_temp.update(
          {
            status_cta: "4",
            updated_at: new Date().toISOString("en-ID", {
              timeZone: "Asia/Jakarta",
            }),
          },
          {
            where: {
              mgisession: req.body.id,
            },
          }
        );
        logger.info("update db success: " + req.body.id);
        Roles.findAll({
          raw: true,
          where: {
            name: "maker",
          },
          order: [["email", "ASC"]],
        }).then((roles) => {
          roles.map((activity) => {
            const mailData = {
              from: "no-reply@arsema.co.id", // sender address
              to: activity.email, // list of receivers
              subject: "New send transaction was rejected.",
              text: "",
              html: "<b>Hai! </b><br><br> This transaction was rejected <br/><br><b>Thank you</b>",
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
                logger.error("Error : " + error);
                return false;
              }
              logger.info("Response:" + error);
              return true;
            });
          });
        });
        res.status(200).send({
          status: "success",
          message: "Transaction has been rejected",
        });
      } catch (error) {
        res.status(500).send({
          message: "error",
          errors: error,
        });
        logger.error("Error : " + error);
      }
    } else {
      res.status(200).send({
        status: "error",
        message: "Transaction has not been approved",
      });
    }
  });
}

async function detaillookup(req, res) {
  const url = process.env.SOAP_MG_DEV;
  const token = req.headers.authorization.split(" ")[1];
  const isijson = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  const agenttrans = await Transaksi_send_temp.findOne({
    where: {
      mgisession: req.body.mgiTransactionSessionID,
    },
  });
  const agentids = await Agent_id.findOne({
    where: { agent_id: agenttrans.agent_id },
  });
  var args = {
    agentID: agenttrans.agent_id,
    agentSequence: agentids.pos,
    token: agentids.pos_password,
    timeStamp: moment().tz("Asia/Jakarta").format("YYYY-MM-DDTHH:mm:ss+07:00"),
    apiVersion: "1512",
    clientSoftwareVersion: "2",
    channelType: "SYSTEM",
    mgiTransactionSessionID: req.body.mgiTransactionSessionID,
    includeUseData: false,
    operatorName: req.body.operatorName,
  };

  logger.info(args);
  try {
    // then/catch
    return soap.createClient(url, {}, function (err, client) {
      client.detailLookup(args, function (err, result) {
        fs.appendFile(
          "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
          "\n\nRequest \n" + formatXml(client.lastRequest),
          function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          }
        );

        // Or
        fs.appendFile(
          "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
          "\n\nResponse \n" + formatXml(client.lastResponse),
          function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          }
        );
        logger.info("Request:" + client.lastRequest);
        logger.info("Response:" + client.lastResponse);
        var repl = client.lastResponse.replaceAll("soapenv:", "");
        var repl = repl.replaceAll("ac:", "");

        parseString(repl, function (err, results) {
          if (err) {
            throw {
              Fault: {
                error: {
                  data: {
                    err,
                  }, //Error object from catch
                },
              },
            };
          } else {
            if (results.Envelope.Body[0].Fault != undefined) {
              res.status(200).send({
                status: "error",
                message:
                  results.Envelope.Body[0].Fault[0].detail[0].errors[0]
                    .error[0],
              });
            } else if (
              results.Envelope.Body[0].detailLookupResponse != undefined
            ) {
              res.status(200).send({
                status: "success",
                message: results.Envelope.Body[0].detailLookupResponse[0],
              });
            } else {
              res.status(200).send({ status: "error", message: results });
            }
          }
        });
      });
    });
  } catch (error) {
    res.status(500).send({
      message: "error",
      errors: err,
    });
    logger.error("Error : " + err);
  }
}
async function detaillookuppos(req, res) {
  const url = process.env.SOAP_MG_DEV;
  Transaksi_send_pos.findOne({
    where: {
      mgisession: req.body.mgiTransactionSessionID,
    },
    order: [["created_at", "DESC"]],
  })
    .then((transaction) => {
      if (!transaction) {
        logger.error("Transaction is not found");
        return res.status(404).send({
          message: "error",
          errors: "Transaction is not found",
        });
      }
      var lengths = transaction.id_pos.length;
      var datagentid = "";
      if (lengths == 5) {
        datagentid = transaction.id_pos + "00";
      } else if (lengths == 6) {
        datagentid = transaction.id_pos + "0";
      } else {
        datagentid = transaction.id_pos;
      }
      Agent_id.findOne({
        where: {
          id_pos: datagentid,
        },
        order: [["created_at", "DESC"]],
      })
        .then((agentid) => {
          if (!agentid) {
            logger.error("Agent id is not found");
            return res.status(404).send({
              message: "error",
              errors: "Agent id is not found",
            });
          }

          args = {
            agentID: agentid.agent_id,
            agentSequence: agentid.pos,
            token: agentid.pos_password,
            timeStamp: moment()
              .tz("Asia/Jakarta")
              .format("YYYY-MM-DDTHH:mm:ss+07:00"),
            apiVersion: "1512",
            clientSoftwareVersion: "2",
            channelType: "SYSTEM",
            referenceNumber: transaction.no_referensi,
            includeUseData: false,
            operatorName: req.body.operatorName,
          };
          logger.info(args);
          try {
            // then/catch
            logger.info(args);
            return soap.createClient(url, {}, function (err, client) {
              client.detailLookup(args, function (err, result) {
                fs.appendFile(
                  "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
                  "\n\nRequest \n" + formatXml(client.lastRequest),
                  function (err) {
                    if (err) {
                      return console.log(err);
                    }
                    console.log("The file was saved!");
                  }
                );

                // Or
                fs.appendFile(
                  "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
                  "\n\nResponse \n" + formatXml(client.lastResponse),
                  function (err) {
                    if (err) {
                      return console.log(err);
                    }
                    console.log("The file was saved!");
                  }
                );
                logger.info("Request:" + client.lastRequest);
                logger.info("Response:" + client.lastResponse);
                var repl = client.lastResponse.replaceAll("soapenv:", "");
                var repl = repl.replaceAll("ac:", "");

                parseString(repl, function (err, results) {
                  if (err) {
                    throw {
                      Fault: {
                        error: {
                          data: {
                            err,
                          }, //Error object from catch
                        },
                      },
                    };
                  } else {
                    if (results.Envelope.Body[0].Fault != undefined) {
                      res.status(200).send({
                        status: "error",
                        message:
                          results.Envelope.Body[0].Fault[0].detail[0].errors[0]
                            .error[0],
                      });
                    } else if (
                      results.Envelope.Body[0].detailLookupResponse != undefined
                    ) {
                      res.status(200).send({
                        status: "success",
                        message:
                          results.Envelope.Body[0].detailLookupResponse[0],
                      });
                    } else {
                      res
                        .status(200)
                        .send({ status: "error", message: results });
                    }
                  }
                });
              });
            });
          } catch (error) {
            res.status(500).send({
              message: "error",
              errors: err,
            });
            logger.error("Error : " + err);
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "error",
            errors: err,
          });
          logger.error("Error : " + err);
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error",
        errors: err,
      });
      logger.error("Error : " + err);
    });
}
async function detaillookuprefnumber(req, res) {
  const url = process.env.SOAP_MG_DEV;
  var args = {
    agentID: process.env.AGENT_ID,
    agentSequence: process.env.AGENT_SEQUENCE,
    token: process.env.TOKEN,
    timeStamp: moment().tz("Asia/Jakarta").format("YYYY-MM-DDTHH:mm:ss+07:00"),
    apiVersion: "1512",
    clientSoftwareVersion: "2",
    channelType: "SYSTEM",
    referenceNumber: req.body.referenceNumber,
    includeUseData: false,
    operatorName: req.body.operatorName,
  };

  logger.info(args);
  try {
    // then/catch
    return soap.createClient(url, {}, function (err, client) {
      client.detailLookup(args, function (err, result) {
        fs.appendFile(
          "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
          "\n\nRequest \n" + formatXml(client.lastRequest),
          function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          }
        );

        // Or
        fs.appendFile(
          "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
          "\n\nResponse \n" + formatXml(client.lastResponse),
          function (err) {
            if (err) {
              return console.log(err);
            }
            console.log("The file was saved!");
          }
        );
        logger.info("Request:" + client.lastRequest);
        logger.info("Response:" + client.lastResponse);
        var repl = client.lastResponse.replaceAll("soapenv:", "");
        var repl = repl.replaceAll("ac:", "");

        parseString(repl, function (err, results) {
          if (err) {
            throw {
              Fault: {
                error: {
                  data: {
                    err,
                  }, //Error object from catch
                },
              },
            };
          } else {
            if (results.Envelope.Body[0].Fault != undefined) {
              res.status(200).send({
                status: "error",
                message:
                  results.Envelope.Body[0].Fault[0].detail[0].errors[0]
                    .error[0],
              });
            } else if (
              results.Envelope.Body[0].detailLookupResponse != undefined
            ) {
              res.status(200).send({
                status: "success",
                message: results.Envelope.Body[0].detailLookupResponse[0],
              });
            } else {
              res.status(200).send({ status: "error", message: results });
            }
          }
        });
      });
    });
  } catch (error) {
    res.status(500).send({
      message: "error",
      errors: err,
    });
    logger.error("Error : " + err);
  }
}

async function detaillookuprefnumberpos(req, res) {
  const url = process.env.SOAP_MG_DEV;
  var args = {};

  Transaksi_send_pos.findOne({
    where: {
      no_referensi: req.body.referenceNumber,
    },
    order: [["created_at", "DESC"]],
  })
    .then((transaction) => {
      if (!transaction) {
        logger.error("Transaction is not found");
        return res.status(404).send({
          message: "error",
          errors: "Transaction is not found",
        });
      }
      var lengths = transaction.id_pos.length;
      var datagentid = "";
      if (lengths == 5) {
        datagentid = transaction.id_pos + "00";
      } else if (lengths == 6) {
        datagentid = transaction.id_pos + "0";
      } else {
        datagentid = transaction.id_pos;
      }
      Agent_id.findOne({
        where: {
          id_pos: datagentid,
        },
        order: [["created_at", "DESC"]],
      })
        .then((agentid) => {
          if (!agentid) {
            logger.error("Agent id is not found");
            return res.status(404).send({
              message: "error",
              errors: "Agent id is not found",
            });
          }

          args = {
            agentID: agentid.agent_id,
            agentSequence: agentid.pos,
            token: agentid.pos_password,
            timeStamp: moment()
              .tz("Asia/Jakarta")
              .format("YYYY-MM-DDTHH:mm:ss+07:00"),
            apiVersion: "1512",
            clientSoftwareVersion: "2",
            channelType: "SYSTEM",
            referenceNumber: req.body.referenceNumber,
            includeUseData: false,
            operatorName: req.body.operatorName,
          };
          logger.info(args);
          try {
            // then/catch
            return soap.createClient(url, {}, function (err, client) {
              client.detailLookup(args, function (err, result) {
                fs.appendFile(
                  "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
                  "\n\nRequest \n" + formatXml(client.lastRequest),
                  function (err) {
                    if (err) {
                      return console.log(err);
                    }
                    console.log("The file was saved!");
                  }
                );

                // Or
                fs.appendFile(
                  "logs/" + new moment().format("YYYY-MM-DD") + ".txt",
                  "\n\nResponse \n" + formatXml(client.lastResponse),
                  function (err) {
                    if (err) {
                      return console.log(err);
                    }
                    console.log("The file was saved!");
                  }
                );
                logger.info("Request:" + client.lastRequest);
                logger.info("Response:" + client.lastResponse);
                var repl = client.lastResponse.replaceAll("soapenv:", "");
                var repl = repl.replaceAll("ac:", "");

                parseString(repl, function (err, results) {
                  if (err) {
                    throw {
                      Fault: {
                        error: {
                          data: {
                            err,
                          }, //Error object from catch
                        },
                      },
                    };
                  } else {
                    if (results.Envelope.Body[0].Fault != undefined) {
                      res.status(200).send({
                        status: "error",
                        message:
                          results.Envelope.Body[0].Fault[0].detail[0].errors[0]
                            .error[0],
                      });
                    } else if (
                      results.Envelope.Body[0].detailLookupResponse != undefined
                    ) {
                      res.status(200).send({
                        status: "success",
                        message:
                          results.Envelope.Body[0].detailLookupResponse[0],
                      });
                    } else {
                      res
                        .status(200)
                        .send({ status: "error", message: results });
                    }
                  }
                });
              });
            });
          } catch (error) {
            res.status(500).send({
              message: "error",
              errors: err,
            });
            logger.error("Error : " + err);
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: "error",
            errors: err,
          });
          logger.error("Error : " + err);
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: "error",
        errors: err,
      });
      logger.error("Error : " + err);
    });
}

module.exports = {
  countryInfo,
  provinceInfo,
  send,
  sendgfpp,
  sendvalidation,
  sendcommit,
  detaillookup,
  detaillookuppos,

  listTransaction,
  detailtransaction,
  sendcheck,
  sendreject,
  countTransaction,
  detailtransactionsend,
  detaillookuprefnumber,

  detailtransactionsendref,

  mailtest,

  detailtransactionsendposref,
  detaillookuprefnumberpos,
  detailtransactionsendpos,

  listTransactionToday,
  detailAgentID,
  listTransactionSendByAgent,
  listTransactionSendByAgentMonth,
  listTransactionOK,
};
