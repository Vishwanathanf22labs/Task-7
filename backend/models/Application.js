const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Job = require("./Job");

const Application = sequelize.define("Application", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "accepted", "rejected"),
    defaultValue: "pending",
  },
});

Application.belongsTo(User, { foreignKey: "userId", as: "candidate" });
Application.belongsTo(Job, { foreignKey: "jobId", as: "job" });

module.exports = Application;
