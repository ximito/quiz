module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Quiz',
    {
        pretunta:  DataTypes.STRING,
        respuesta: DataTypes.STRING,
    });
}
