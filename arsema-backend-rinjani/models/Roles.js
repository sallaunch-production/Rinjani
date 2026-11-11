const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");

const Role = sq.define("roles_clients", {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
});

module.exports = Role;
