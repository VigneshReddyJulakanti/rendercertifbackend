const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const User = require("../model/user");
var ObjectID = require('mongodb').ObjectID;  

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new user
    let user ={
      name: req.body.name,
      avatar: result.secure_url,
      cloudinary_id: result.public_id,
    };
    // Save user
    // await user.save();
    console.log(user);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
}); 

 
router.post("/check",async(req,res)=>{
  try{
  const user=await User.findById(ObjectID(req.body._id));
  // console.log(user,req,req.body._id,ObjectID(req.body._id))
  console.log(req.body._id)
  if(user){
    res.json({success:true,user});
  }else{ 
    res.json({success:false});
  }
}catch(err){
  res.json({success:false});
}
})

router.post("/getcertis",async (req,res)=>{
  try{
    const data=await User.find({username:req.body.username});
    console.log(data);
    res.json(data);

  }catch (err) {
    console.log(err);
  }
})

router.post("/save", async (req, res) => {
  try {
    console.log(req.body);
    // Upload image to cloudinary
   

    // Create new user
    let user = await  User.create({
      username: req.body.username,
      avatar: req.body.avatar,
      
    });
    // Save user
    
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});
router.get("/", async (req, res) => {
  try {
    let user = await User.find();
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});




router.get("/:id", async (req, res) => {
  try {
    // Find user by id
    let user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
