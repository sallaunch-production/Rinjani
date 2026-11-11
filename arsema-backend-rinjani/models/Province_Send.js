const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");

const Province_Info = sq.define("province_info", {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    countryCode: {
        type: DataTypes.STRING,
      },
    stateProvinceName: {
      type: DataTypes.STRING,
    },
    stateProvinceCode: {
        type: DataTypes.STRING,
      }
  },{ freezeTableName: true,timestamp:false});

  module.exports = Province_Info;