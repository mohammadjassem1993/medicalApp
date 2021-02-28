const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



// validation
const { registerValidation, loginValidation } = require("../validation");
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
// login route
router.post("/login", async (req, res) => {
  // validate the user
  const { error } = loginValidation(req.body);
  // throw validation errors
  if (error) return res.status(400).json({ error:   error.details[0].message });
  const user = await User.findOne({ email: req.body.email });
  // throw error when email is wrong
  if (!user) return res.status(400).json({ error: "Email is wrong" });
  // check for password correctness
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
  return res.status(400).json({ error: "Password is wrong" });


// create token
const token = jwt.sign(
  // payload data
  {
    name: user.name,
    id: user._id,
    role: user.role
  },
  process.env.TOKEN_SECRET
);
res.header("auth-token", token).json({
  error: null,
  data: {
    token,
  },
});
});



module.exports = router;