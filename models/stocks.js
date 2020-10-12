module.exports = function (sequelize, DataTypes) {
  var Stock = sequelize.define("Stock", {
    // Giving the Stock model a name of type STRING
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    date: DataTypes.STRING
  });
  return Stock;
};
