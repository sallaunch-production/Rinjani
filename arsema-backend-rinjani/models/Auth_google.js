const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");

const AuthGoogle = sq.define("auth_google", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
      },
    code: {
      type: DataTypes.STRING,
    },
  },{ freezeTableName: true,timestamp:false});

  module.exports = AuthGoogle;