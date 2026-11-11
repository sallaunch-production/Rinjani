const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");

const Country_Info = sq.define("countryinfo", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    countrycode: {
        type: DataTypes.STRING,
      },
    countryname: {
      type: DataTypes.STRING,
    },
    countrylegacycode: {
        type: DataTypes.STRING,
      },
    sendactive: {
        type: DataTypes.STRING,
      },
      receiveactive: {
        type: DataTypes.STRING,
      },
      sendactive: {
        type: DataTypes.STRING,
      },
      directedsendcountry: {
        type: DataTypes.STRING,
      },
      mgdirectedsendcountry:{
        type: DataTypes.STRING,
      }
  },{ freezeTableName: true,timestamp:false});

  module.exports = Country_Info;