const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



// validation
const  {registerValidation}= require("../validation");
router.post("/register", async (req, res) => {
  // validate the user
  const { error } = registerValidation(req.body);


  if (error) return res.status(400).json({ error: error.details[0].message });

  //checkexisting emails

  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist)
  return res.status(400).json({ error: "Email already exists" });

  // hash the password
const salt = await bcrypt.genSalt(10);
const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password,
    role:req.body.role
  });
  try {
    const savedUser = await user.save();
    res.json({ error: null, data: savedUser });
  } catch (error) {
    res.status(400).json({ error });
  }
});



// get all users
router.get('/', async(req, res) => {
    
  try {

      let p = await User.find({})
          res.send(p)


  } catch (error) {
      res.status(400).json({ error });
  }
});




module.exports = router;