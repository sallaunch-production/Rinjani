const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");

const User = sq.define("users_client", {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  level: {
    type: DataTypes.STRING,
  },
  remember_token: {
    type: DataTypes.STRING,
  },
  last_update: {
    type: DataTypes.DATE,
  },
  agentid: {
    type: DataTypes.STRING,
  },
});

module.exports = User;
