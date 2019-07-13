'use strict';
module.exports = (sequelize, DataTypes) => {
  const WordLink = sequelize.define('WordLink', {
    word_a: DataTypes.INTEGER,
    word_b: DataTypes.INTEGER
  }, {});
  WordLink.associate = function(models) {
    // associations can be defined here
  };
  return WordLink;
};