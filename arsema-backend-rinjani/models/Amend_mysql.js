const { sq2 } = require("../config/db");
const { DataTypes } = require("sequelize");

const Amend_mysql = sq2.define("amend", {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    no_referensi :{
      type: DataTypes.STRING,
    },
    first_name : {
      type: DataTypes.STRING,
    },
    middle_name : {
      type: DataTypes.STRING,
    },
    last_name : {
      type: DataTypes.STRING,
    },
    last_name2 : {
      type: DataTypes.STRING,
    },
    operator : {
      type: DataTypes.STRING,
    },
    checker : {
      type: DataTypes.STRING,
    },
    status : {
      type: DataTypes.INTEGER,
    },
    approval : {
      type: DataTypes.STRING,
    },
    mgisession : {
      type: DataTypes.STRING,
    },
    created_at : {
      type: DataTypes.DATE,
    },
    updated_at : {
      type: DataTypes.DATE,
    },
  },{ freezeTableName: true,timestamp:false});

  module.exports = Amend_mysql;