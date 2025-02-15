'use strict';
 const { Model, DataTypes } = require('sequelize');
 
 module.exports = (sequelize, DataTypes) => { 
   class Review extends Model {
    static associate(models) {
      
      // define association here

      Review.belongsTo(models.Spot, { 
        foreignKey: 'reviewId'
      });

      Review.belongsTo(models.User, { 
        foreignKey: 'UserId'
      });

      Review.hasMany(models.ReviewImage, { 
        foreignKey: 'reviewId'
      });


     } 
   } 
 

   Review.init(
     {
 

    // id: { 
    //   type: DataTypes.INTEGER, 
    //   allowNull: false,
    //   unique: true,
    //   primaryKey: true,
    // },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
 
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // unique: true,
    },
 
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
       len: [3, 256],
      },
    },
 
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
    },

    updatedAt: {
      type: DataTypes.DATE,
    },

  },


   {
     sequelize,
     modelName: 'Review',
     defaultScope: {
       attributes: {
        //  exclude: ['createdAt', 'updatedAt'],
       },
     },
   }
 );
   return Review;
 };