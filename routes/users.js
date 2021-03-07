const router = require("express").Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ObjectId = require('mongodb').ObjectID;   
const authorize = require('./authorize')


// validation
const  {registerValidation}= require("../validation");
router.post("/register", async (req, res) => {
  // validate the user

  //autorize the user roles should be admin
  let a =await authorize(req.user.id,['admin']);
  console.log(a)
  if(!a){
    res.status(401).json({ error: 'UnAuthorized, This Action will be reported to an admin' })
  }


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

//get one user
router.get('/id/:id', async(req, res) => {
  var id = new ObjectId(req.params.id);
  try {

      //autorize the user roles should be admin
  let a =await authorize(req.user.id,['admin']);
  console.log(a)
  if(!a){
    res.status(401).json({ error: 'UnAuthorized, This Action will be reported to an admin' })
  }
      let user = await User.findById(id)
      if (user) {
          res.send(user)
      } else {
          res.send("User does not exist")
      }
  } catch (error) {
      res.status(400).json({ error });
  }
});

//change password
router.put('/updatepass', async(req, res) => {
try{

      var id = new ObjectId(req.user.id);


      //COMPARE old password
      const user = await User.findOne({ _id: req.user.id });

    const validPassword = await bcrypt.compare(req.body.oldpassword, user.password);
      
    if (!validPassword)
    return res.status(400).json({ error: "Old Password is wrong" });
  
    // hash the password

      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.newpassword, salt);





  
      User.updateOne({_id: id}, {$set: {password: password}}
    , function(err, affected, resp) {

      res.json({ error: err, data: 'password changed' });
    })
  } catch(error){
    console.log(error)
    res.status(400).json({ error });
  }
})



//change role
router.put('/updateroles/id/:id', async(req, res) => {
  try{


      //autorize the user roles should be admin
  let a =await authorize(req.user.id,['admin']);
  console.log(a)
  if(!a){
    res.status(401).json({ error: 'UnAuthorized, This Action will be reported to an admin' })
  }
        var id = new ObjectId(req.params.id);

  
  
  
    
        User.updateOne({_id: id}, {$set: {role: req.body.role}}
      , function(err, affected, resp) {
  
        res.json({ error: err, data: 'roles changed' });
      })
    } catch(error){
      console.log(error)
      res.status(400).json({ error });
    }
  })

//get one user
router.get('/id/:id', async(req, res) => {
  var id = new ObjectId(req.params.id);
  try {

      //autorize the user roles should be admin
  let a =await authorize(req.user.id,['admin']);
  console.log(a)
  if(!a){
    res.status(401).json({ error: 'UnAuthorized, This Action will be reported to an admin' })
  }
      let user = await User.findById(id)
      if (user) {
          res.send(user)
      } else {
          res.send("User does not exist")
      }
  } catch (error) {
      res.status(400).json({ error });
  }
});

//delete user
router.delete('/id/:id', async(req, res) => {
try{


    //autorize the user roles should be admin
    let a =await authorize(req.user.id,['admin']);
    console.log(a)
    if(!a){
      res.status(401).json({ error: 'UnAuthorized, This Action will be reported to an admin' })
    }



      var id = new ObjectId(req.user.id);

      User.deleteOne({_id: id}
    , function(err, affected, resp) {

      res.json({ error: err, data: 'user deleted' });
    })
  } catch(error){
    console.log(error)
    res.status(400).json({ error });
  }
})


// get all users
router.get('/', async(req, res) => {
    
  try {

      //autorize the user roles should be admin
  let a =await authorize(req.user.id,['admin']);
  console.log(a)
  if(!a){
    res.status(401).json({ error: 'UnAuthorized, This Action will be reported to an admin' })
  }

      let p = await User.find({})
          res.send(p)


  } catch (error) {
      res.status(400).json({ error });
  }
});




module.exports = router;