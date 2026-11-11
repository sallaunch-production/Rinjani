const { sq } = require("../config/db");
const { DataTypes } = require("sequelize");

const Agent_id = sq.define("agent_id", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
  },
  id_pos: {
    type: DataTypes.STRING,
  },
  agent_id: {
    type: DataTypes.STRING,
  },
  alamat: {
    type: DataTypes.STRING,
  },
  nama: {
    type: DataTypes.STRING,
  },
  legacy: {
    type: DataTypes.STRING,
  },
  pos: {
    type: DataTypes.STRING,
  },
  pos_password: {
    type: DataTypes.STRING,
  },

  created_at: {
    type: DataTypes.DATE,
  },
  updated_at: {
    type: DataTypes.DATE,
  },
  corporate: {
    type: DataTypes.STRING,
  },
});

module.exports = Agent_id;
