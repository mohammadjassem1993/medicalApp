const ObjectId = require('mongodb').ObjectID;   

const User = require("../model/user");


const  authorize = async (idd, allowedroles) => {
  let a=false;
  var id = new ObjectId(idd);
console.log(id)
  let user = await User.findById(id)
  console.log(user.role)
  console.log(allowedroles)
  console.log('start')
  allowedroles.forEach(role => {
    console.log(role)

    user.role.forEach(r =>{
      console.log(r)
      if(r==role){
        console.log('rrrrrrrrrrr')
        console.log(role)
        a= true;
      }

      });
  });
  
        
    
  return a;
  


  };

  module.exports = authorize;