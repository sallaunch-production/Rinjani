const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CountrySend = require("../models/Country_Send");
const TransaksiReceiveTemp = require("../models/Transaksi_Receive_Temp");
const TransaksiReceivePG = require("../models/Transaksi_Receive_pg");
var parseString = require("xml2js").parseString;
const moment = require("moment-timezone");
const soap = require("soap");
require("dotenv").config();
const { sq } = require("../config/db");
const { Op, QueryTypes } = require("sequelize");
const { logger } = require("../config/logger");
const Agent_id = require("../models/Agent_id");
const nodemailer = require("nodemailer");
const Roles = require("../models/Roles");
const User = require("../models/User");
const fs = require("fs");
const Transaksi_receive_temp = require("../models/Transaksi_Receive_Temp");
const Transaksi_receive_pg = require("../models/Transaksi_Receive_pg");
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
async function receive(req, res) {
  try {
    const url = process.env.SOAP_MG_DEV;
    //const url = "http://localhost/mg/receive.wsdl";
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
      referenceNumber: req.body.referenceNumber,
      operatorName: req.body.operatorName,
    };

    logger.info(args);

    // then/catch
    return soap.createClient(url, {}, function (err, client) {
      client.referenceNumber(args, function (err, result) {
        logger.info("Request:" + client.lastRequest);
        logger.info("Response:" + client.lastResponse);
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
              results.Envelope.Body[0].referenceNumberResponse != undefined
            ) {
              res.status(200).send({
                status: "success",
                message: results.Envelope.Body[0].referenceNumberResponse[0],
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

async function receivegfpp(req, res) {
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
      receiveCountry: req.body.receiveCountry,
      thirdPartyType: "NONE",
      receiveCurrency: req.body.receiveCurrency,
      amount: req.body.amount,
      productType: "RCV",
      consumerId: 0,
      formFreeStaging: false,
    };

    logger.info(args);

    // then/catch
    return soap.createClient(url, {}, function (err, client) {
      client.getFieldsForProduct(args, function (err, result) {
        logger.info("Request:" + client.lastRequest);
        logger.info("Response:" + client.lastResponse);
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

async function receivevalidation(req, res) {
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
      referenceNumber: req.body.referenceNumber,
      receiveCurrency: req.body.receiveCurrency,
      agentCheckAmount: req.body.agentCheckAmount,
      receiverAddress: req.body.receiverAddress,
      receiverCity: req.body.receiverCity,
      receiverState: req.body.receiverState,
      receiverZipCode: req.body.receiverZipCode,
      receiverCountry: req.body.receiverCountry,
      receiverMailingAddress: req.body.receiverMailingAddress,
      receiverMailingCity: req.body.receiverMailingCity,
      receiverMailingState: req.body.receiverMailingState,
      receiverMailingZipCode: req.body.receiverMailingZipCode,
      receiverMailingCountry: req.body.receiverMailingCountry,
      receiverPhotoIdType: req.body.receiverPhotoIdType,
      receiverPhotoIdNumber: req.body.receiverPhotoIdNumber,
      receiverPhotoIdState: req.body.receiverPhotoIdState,
      receiverPhotoIdCountry: req.body.receiverPhotoIdCountry,
      receiverDOB: req.body.receiverDOB,
      receiverOccupation: req.body.receiverOccupation,
      receiverBirthCity: req.body.receiverBirthCity,
      receiverBirthCountry: req.body.receiverBirthCountry,
      receiverNationalityCountry: req.body.receiverNationalityCountry,
      consumerId: 0,
      receiverPhone: req.body.receiverPhone,
      mgiTransactionSessionID: req.body.mgiTransactionSessionID,
      formFreeStaging: false,
      receivePurposeOfTransaction: req.body.receivePurposeOfTransaction,
      relationshipToSender: req.body.relationshipToSender,
      receiverGender: req.body.receiverGender,
      receiverCitizenshipCountry: req.body.receiverCitizenshipCountry,
      receiverPhoneCountryCode: req.body.receiverPhoneCountryCode,
      receiverIntendedUseOfMGIServices:
        req.body.receiverIntendedUseOfMGIServices,
    };

    logger.info(args);

    // then/catch
    return soap.createClient(url, {}, function (err, client) {
      client.receiveValidation(args, function (err, result) {
        logger.info("Request:" + client.lastRequest);
        logger.info("Response:" + client.lastResponse);
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
              results.Envelope.Body[0].receiveValidationResponse != undefined
            ) {
              TransaksiReceiveTemp.create({
                nama_pengirim: req.body.sender,
                nama_penerima: req.body.receiver,
                negara_penerima: "IDN",
                mgisession: req.body.mgiTransactionSessionID,
                negara_pengirim: req.body.originatingCountry,
                no_referensi: req.body.referenceNumber,
                identitas: req.body.receiverPhotoIdType,
                nomor_identitas: req.body.receiverPhotoIdNumber,
                tanggal_lahir: req.body.receiverDOB,
                alamat_penerima: req.body.receiverAddress,
                telepon_penerima: req.body.receiverPhone,
                kota_penerima: req.body.receiverCity,
                pekerjaan: req.body.receiverOccupation,
                kewarganegaraan: req.body.receiverCitizenshipCountry,
                tujuan_penggunaan_dana: req.body.receivePurposeOfTransaction,
                id_pos: "",
                total_collect_amount: req.body.totalAmountToCollect,
                hubungan: req.body.relationshipToSender,
                receiverIntendedUseOfMGIServices:
                  req.body.receiverIntendedUseOfMGIServices,
                kota_kelahiran: req.body.receiverBirthCity,
                tanggal: new Date().toISOString("en-ID", {
                  timeZone: "Asia/Jakarta",
                }),
                deltawork: "",
                deltawork708: "",
                provinsi: req.body.receiverState,
                mgisession: req.body.mgiTransactionSessionID,
                sumber_dana: req.body.sourceOfFunds,
                tempat_lahir: req.body.receiverBirthCity,
                kode_pos: req.body.receiverZipCode,
                kode_pos_penerima: req.body.receiverZipCode,
                jenis_kelamin: req.body.receiverGender,
                amount: req.body.agentCheckAmount,
                pesan: "",
                timestamp: req.body.timestamp,
                negara_penerima: "IDN",
                photoidcountry: req.body.receiverPhotoIdCountry,
                photoidstate: req.body.receiverPhotoIdState,
                arsema_validation: "",
                status_cta: 2,
                tanggal_transaksi: "",
                alamat_domisili_penerima: req.body.receiverMailingAddress,
                kota_domisili_penerima: req.body.receiverMailingCity,
                kode_pos_domisili_penerima: req.body.receiverMailingZipCode,
                provinsi_domisili_penerima: req.body.receiverMailingState,
                negara_domisili_penerima: req.body.receiverMailingCountry,

                created_at: moment()
                  .tz("Asia/Jakarta")
                  .format("YYYY-MM-DDTHH:mm:ss+07:00"),
                updated_at: moment()
                  .tz("Asia/Jakarta")
                  .format("YYYY-MM-DDTHH:mm:ss+07:00"),
                agent_id: agentids.agent_id,
                corporate: agentids.corporate,
                maker: isijson.email,
              });
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
                        "New transaction is coming. Please approve this transaction",
                      text: "",
                      html: `<b>Hi! </b><br> Please check latest receive transaction below:<br/><br/>
                                      <table style="width:75%;" cellpadding=10>
                                          <tr><td>Reference Number:</td><td>${req.body.referenceNumber}</td></tr>
                                          
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
                      return true;
                    });
                  }
                });
              });
              res.status(200).send({
                status: "success",
                message: results.Envelope.Body[0].receiveValidationResponse[0],
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

async function receivecommit(req, res) {
  try {
    const url = process.env.SOAP_MG_DEV;

    const token = req.headers.authorization.split(" ")[1];
    const isijson = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    logger.info(args);
    const receiveid = await Transaksi_receive_temp.findOne({
      where: {
        mgisession: req.body.mgiTransactionSessionID,
      },
    });
    const agentids = await Agent_id.findOne({
      where: { agent_id: receiveid.agent_id },
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
      productType: "RCV",
    };

    // then/catch
    return soap.createClient(url, {}, function (err, client) {
      client.commitTransaction(args, function (err, result) {
        logger.info("Request:" + client.lastRequest);
        logger.info("Response:" + client.lastResponse);
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
              results.Envelope.Body[0].commitTransactionResponse != undefined
            ) {
              Transaksi_receive_temp.findOne({
                where: {
                  mgisession: req.body.mgiTransactionSessionID,
                },
              })
                .then((transaction) => {
                  if (!transaction) {
                    logger.error("Transaction is not found");
                    return res.status(404).send({
                      message: "error",
                      errors: "Transaction is not found",
                    });
                  } else {
                    const mailData = {
                      from: "no-reply@arsema.co.id", // sender address
                      to: isijson.email, // list of receivers
                      subject: "New transaction is approved. Thank you",
                      text: "",
                      html: "<b>Hai! </b><br><br> <br/><br><b>Thank you</b>",
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
                    TransaksiReceivePG.create({
                      id_transaksi: moment
                        .tz(new Date(), "Asia/Jakarta")
                        .format("YYYYMMDDHHmmss"),
                      nama_pengirim: transaction.nama_pengirim,
                      nama_penerima: transaction.nama_penerima,
                      negara_penerima: "IDN",

                      negara_pengirim: transaction.negara_pengirim,
                      no_referensi: transaction.no_referensi,
                      identitas: transaction.identitas,
                      nomor_identitas: transaction.nomor_identitas,
                      tanggal_lahir: transaction.tanggal_lahir,
                      alamat_penerima: transaction.alamat_penerima,
                      telepon_penerima: transaction.telepon_penerima,
                      kota_penerima: transaction.kota_penerima,
                      pekerjaan: transaction.pekerjaan,
                      kewarganegaraan: transaction.kewarganegaraan,
                      tujuan_penggunaan_dana:
                        transaction.tujuan_penggunaan_dana,
                      id_pos: "",

                      hubungan: transaction.hubungan,
                      receiverIntendedUseOfMGIServices:
                        transaction.receiverIntendedUseOfMGIServices,
                      kota_kelahiran: transaction.kota_kelahiran,
                      tanggal: moment()
                        .tz("Asia/Jakarta")
                        .format("YYYY-MM-DDTHH:mm:ss+07:00"),
                      deltawork: "",
                      deltawork708: "",
                      provinsi: transaction.provinsi,
                      mgisession: transaction.mgisession,
                      sumber_dana: transaction.sumber_dana,
                      tempat_lahir: transaction.tempat_lahir,
                      kode_pos: transaction.kode_pos,
                      kode_pos_penerima: transaction.kode_pos_penerima,
                      jenis_kelamin: transaction.jenis_kelamin,
                      amount: transaction.amount,
                      pesan: "",
                      timestamp: transaction.timestamp,

                      photoidcountry: transaction.photoidcountry,
                      photoidstate: transaction.photoidstate,
                      arsema_validation: "",
                      status_cta: 2,
                      tanggal_transaksi: "",
                      alamat_domisili_penerima:
                        transaction.alamat_domisili_penerima,
                      kota_domisili_penerima:
                        transaction.kota_domisili_penerima,
                      kode_pos_domisili_penerima:
                        transaction.kode_pos_domisili_penerima,
                      provinsi_domisili_penerima:
                        transaction.provinsi_domisili_penerima,
                      negara_domisili_penerima:
                        transaction.negara_domisili_penerima,
                      agent_id: transaction.agent_id,
                      corporate: transaction.corporate,
                      maker: transaction.maker,
                      approver: isijson.email,
                      created_at: moment()
                        .tz("Asia/Jakarta")
                        .format("YYYY-MM-DDTHH:mm:ss+07:00"),
                      updated_at: moment()
                        .tz("Asia/Jakarta")
                        .format("YYYY-MM-DDTHH:mm:ss+07:00"),
                    });
                  }
                })
                .catch((err) => {
                  res.status(500).send({
                    message: "error",
                    errors: err,
                  });
                  logger.error("Response RECEIVE DIRECT:" + err);
                });
              res.status(200).send({
                status: "success",
                message: results.Envelope.Body[0].commitTransactionResponse[0],
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

async function detailreceive(req, res) {
  return Transaksi_receive_temp.findOne({
    where: {
      mgisession: req.body.id,
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

async function detailreceivetemp(req, res) {
  return Transaksi_receive_temp.findOne({
    where: {
      no_referensi: req.body.id,
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

async function listTransactionReceiveAll(req, res) {
  return Transaksi_receive_temp.findAll({
    order: [["created_at", "ASC"]],
  })
    .then((transaksi_receive_temp) => {
      if (!transaksi_receive_temp) {
        logger.error("Transaction is not found");
        return res.status(404).send({
          message: "error",
          errors: "Transaction is not found",
        });
      }

      res.status(200).send({
        transaksi_receive_temp,
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
async function listTransactionReceive(req, res) {
  return Transaksi_receive_temp.findAll({
    where: {
      status_cta: req.body.status,
      mgisession: {
        [Op.ne]: "",
      },
    },
    order: [["created_at", "DESC"]],
  })
    .then((transaksi_receive_temp) => {
      if (!transaksi_receive_temp) {
        logger.error("Transaction is not found");
        return res.status(404).send({
          message: "error",
          errors: "Transaction is not found",
        });
      }

      res.status(200).send({
        transaksi_receive_temp,
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
async function listTransactionReceivePG(req, res) {
  return Transaksi_receive_pg.findAll({
    where: {
      status_cta: req.body.status,
      mgisession: {
        [Op.ne]: "",
      },
    },
    order: [["created_at", "DESC"]],
  })
    .then((transaksi_receive_temp) => {
      if (!transaksi_receive_temp) {
        logger.error("Transaction is not found");
        return res.status(404).send({
          message: "error",
          errors: "Transaction is not found",
        });
      }

      res.status(200).send({
        transaksi_receive_temp,
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
async function receivecheck(req, res) {
  const url = process.env.SOAP_MG_DEV;
  var args = {
    mgisession: req.body.id,
  };
  logger.info(args);
  Transaksi_receive_temp.findOne({
    where: {
      mgisession: req.body.id,
    },
  }).then((Transaksi_receive_temp) => {
    if (!Transaksi_receive_temp) {
      res
        .status(200)
        .send({ status: "error", message: "Transaction is not allowed" });
    } else if (Transaksi_receive_temp.status_cta == "1") {
      try {
        // then/catch
        Transaksi_receive_temp.update(
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

async function receivereject(req, res) {
  const url = process.env.SOAP_MG_DEV;
  var args = {
    mgisession: req.body.id,
  };
  logger.info(args);
  Transaksi_receive_temp.findOne({
    where: {
      mgisession: req.body.id,
    },
  }).then((Transaksi_receive_temp) => {
    if (!Transaksi_receive_temp) {
      res
        .status(200)
        .send({ status: "error", message: "Transaction is not allowed" });
    } else if (Transaksi_receive_temp.status_cta == "2") {
      try {
        // then/catch
        Transaksi_receive_temp.update(
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
        const mailData = {
          from: "no-reply@arsema.co.id", // sender address
          to: "afry@arsema.co.id", // list of receivers
          subject: "New transaction is rejected. Please check this transaction",
          text: "",
          html: "<b>Hai! </b><br> Please check rejected transaction <br/><b>Thank you</b>",
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
async function countTransactionRcv(req, res) {
  if (req.body.status == "") {
    const count = await Transaksi_receive_temp.count({
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
    const count = await Transaksi_receive_temp.count({
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

async function listTransactionByAgent(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const isijson = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  const agentids = await Agent_id.findOne({
    where: { agent_id: isijson.agentid },
  });

  const transaction = await sq.query(
    "select nama,agent_id, (select count(no) from transaksi_receive_clients where agent_id=agent_id.agent_id and created_at::text like $created_at) as total from agent_id where corporate = $corporate",
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

async function listTransactionByAgentMonth(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const isijson = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );
  const agentids = await Agent_id.findOne({
    where: { agent_id: isijson.agentid },
  });

  const transaction = await sq.query(
    "select nama,agent_id, (select count(no) from transaksi_receive_clients where agent_id=agent_id.agent_id and created_at::text like $created_at) as total from agent_id where corporate = $corporate",
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

  return TransaksiReceivePG.findAll({
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
module.exports = {
  receive,
  receivegfpp,
  receivevalidation,
  receivecommit,
  detailreceive,
  detailreceivetemp,
  listTransactionReceive,
  listTransactionReceivePG,
  receivecheck,
  receivereject,
  countTransactionRcv,
  listTransactionReceiveAll,
  listTransactionByAgent,
  listTransactionByAgentMonth,
  listTransactionOK,
};
