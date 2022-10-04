var jwt = require("jsonwebtoken");

const JWT_SECRET = "liongiraffe";

const fetchuser=(req,res,next)=>{

    try{
    const token=req.header("auth-token");
    if(!token){
        res.status(401).send({error:"Please authenticate using a valid token."});
    }
    var decoded = jwt.verify(token, JWT_SECRET);
    req.user=decoded.user;
    next();
}catch(error){
    res.status(401).send({error:"Please authenticate using a valid token."});

}

}

module.exports =fetchuser