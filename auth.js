const jwt = require('jsonwebtoken')

module.exports = (req,res,next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, 'MQDzAAlNsFHaEg4ICA')

    next()
  } catch(error) {
    if(error.name === "TokenExpiredError") {
      return res.status(401).send({
        message: 'Süren dolmuştur!',
        status: -1
      })
    } else if(error.name === "JsonWebTokenError") {
      return res.status(401).send({
        message: 'Geçersiz!',
        status: -1
      })
    } else {
      return res.status(401).send({
        message: 'Yetkin yok!',
        status: -1
      })
    }
  }
}