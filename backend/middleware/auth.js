const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports = (req, res, next) =>{

  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decodedToken.id;
    //console.log("toto en calecon", userId, req.body.userId, req.body.userId !== userId);
    
    if (parseInt(req.body.userId) == null) {  
      throw 'Invalid user ID'
    } else {
      next()
    }
  } catch (err) {
    console.log(err)
    res.status(401).json({
      error: new Error('Invalid request!')
    })
  }
}

