'use strict';
module.exports = (sequelize, DataTypes) => {
  const Word = sequelize.define('Word', {
    lang: DataTypes.STRING,
    word: DataTypes.STRING,
    meta: DataTypes.JSONB
  }, {});
  Word.associate = function(models) {
    // associations can be defined here
  };
  return Word;
};