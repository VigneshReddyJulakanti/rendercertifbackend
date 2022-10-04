const express = require("express");
const router = express.Router();
const Login = require("../model/login");
const bcrypt = require("bcrypt");
const fetchuser=require("../middleware/fetchuser")


var jwt = require("jsonwebtoken");

const JWT_SECRET = "liongiraffe";


const { body, validationResult } = require("express-validator");
// const { findById } = require("../model/login");
router.post("/",async(req,res)=>{
  res.send("You are in api/auth")
})
router.post(
  "/createUser",
  [
    body("email", "Invalid mail").isEmail(),
    body("password", "Invalid pass").isLength({ min: 5 })
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({success:success, errors: errors.array() });
    }
    try {
      let user = await Login.findOne({ email: req.body.email });

      if (user) {
        console.log("EMail already exists .......................");
      }

      const salt = await bcrypt.genSaltSync(8);
      const secpassword = await bcrypt.hashSync(req.body.password, salt);

      user = await Login.create({
        password: secpassword,
        email: req.body.email
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      var authtoken = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({success:success, authtoken });

      //   res.json(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json({success:success,error});
      // return res.status(400).json({"errr":"Some error occured"});
    }
  }
);

router.post(
  "/loginuser",
  [
    body("email", "Invalid mail").isEmail(),
    body("password", "Invalid pass").isLength({ min: 5 }),
    
  ],
  async (req, res) => {
    
   
   
    let success =false;
    const errors = validationResult(req);
    

    if (!errors.isEmpty()) {
      return res.status(400).json({ success:success,errors: errors.array() });
    }
    

    let { email, password } = req.body;

  
    try{
    let user = await Login.findOne({ email });
    
  
    if (!user) {
      return res
        .status(400)
        .json({ success:success,error: "Enter the valid credentials .   " });
    }

    let pass_match = await bcrypt.compareSync(password, user.password);
    
    if (!pass_match) {
      return res
        .status(400)
        .json({success:success, error: "Enter the valid credentials .   " });
    }

    const data = {
      user: {
        id: user.id,
      },
    };
   
    var authtoken = jwt.sign(data, JWT_SECRET);
  
    success=true
    res.json({success:success, authtoken });
    

    }catch(e){
      console.log(e);
    }
  }
);


router.get(
    "/userdata",fetchuser,
    async (req, res) => {

        try{
       const user= await Login.findById(req.user.id).select("-password");
       res.json({user})
        }catch(error){
            console.log(error.message);
            res.status(500).send("Internal Server Error")
        }





    }
)



module.exports = router;
