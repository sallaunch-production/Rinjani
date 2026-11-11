const Sequelize = require("sequelize");
require("dotenv").config();
const db_name = process.env.DB_NAME;
const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASS;
const sq = new Sequelize(db_name, db_user, db_password, {
  omitNull: true,
  host: db_host,
  dialect: "postgres",
  define: { timestamps: false, freezeTableName: true },
});
sq.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

module.exports = { sq };
