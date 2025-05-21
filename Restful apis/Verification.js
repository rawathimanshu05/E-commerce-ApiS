const jwt = require('jsonwebtoken')

const verifyTokenUser = (req,res,next) => {
      var token = req.headers.authorization
      jwt.verify(token,process.env.SAULTKEYUSER,(error)=>{
        if(error)
            res.status(401).json({result:'Fail',message:'You are not an Authorized User to acess this API!!'})
        else 
        next()
      })
}


const verifyTokenAdmin = (req,res,next) => {
    var token = req.headers.authorization
    jwt.verify(token,process.env.SAULTKEYADMIN,(error)=>{
        if(error)
            res.status(401).json({result:'fail',message:'you are not an Authorized Admin to acess this Api!!!'})
        else 
        next()
    })
}


module.exports = {
    verifyTokenUser,
    verifyTokenAdmin
}