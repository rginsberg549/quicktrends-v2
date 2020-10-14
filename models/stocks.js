module.exports = function (sequelize, DataTypes) {
  var Stock = sequelize.define("Stock", {
    name: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    price: DataTypes.FLOAT(2),
    lastDiv: DataTypes.FLOAT(2),
    currency: DataTypes.STRING,
    companyName: DataTypes.STRING,
    website: DataTypes.STRING,
    ceo: DataTypes.STRING,
    sector: DataTypes.STRING,
    image: DataTypes.STRING,
    eps: DataTypes.FLOAT(2),
    grossProfitRatio: DataTypes.FLOAT(2),
    netIncomeRatio: DataTypes.FLOAT(2)
  });
  return Stock;
};
