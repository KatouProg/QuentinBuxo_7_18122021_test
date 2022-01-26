// Imports
var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = 'Es8x96SkuVTzFCPjrGzpBXNjdSDRgtsVhxC6JKvSCCQj7UQtvnGRdhKnqdKF7wKr9A6khFGCVwSnyRhtPXbthb4Qb87FPBB7CYDB';

// Exported functions
module.exports ={
    generateTokenForUser: function(userData) {
      return jwt.sign({
        userId: iserData.id,
        isAdmin: userData.isAdmin
      },
      JWT_SIGN_SECRET,
      {
          expiresIn: '1h'
      })  
    }
}