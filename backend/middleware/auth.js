const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports = (req, res, next) =>{

  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decodedToken.userId
    //const tokenId = '' + decodedToken.userId;
    //const userId =  '' + req.body.userId;
    if (req.body.userId && req.body.userId !== userId) {  // if (!tokenId || tokenId !== userId) {
      throw 'Invalid user ID'
    } else {
      next()
    }
  } catch (err) {
    res.status(401).json({
      error: new Error('Invalid request!')
    })
  }
}

