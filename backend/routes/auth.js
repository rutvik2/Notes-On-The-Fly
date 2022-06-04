const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Thisshallindeedbecalleda$ecr#t"


//ROUTE 1: Using POST request to create a user at api/auth/createuser using
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password should be at least of 5 characters').isLength({ min: 5 })
], async(req, res)=>{
  let success=false;
  //To return errors upon validation using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    //To check if user with this email exists already 
    try {
      let user = await User.findOne({"email": req.body.email});
      if(user){
        return res.status(400).json({success, "Error": "Sorry a user with this email already exists"})
      }

      //hasing of password using bcrypt
      const salt = await bcrypt.genSaltSync(10);
      const secPassword = await bcrypt.hash(req.body.password, salt)

      //Creating new user
      user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPassword,
        })

      //making authtoken for user
      const data = {
        user : {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true;
        res.send({success, authtoken})

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Encountered some internal server error");     
    }
     
    })


//ROUTE 2: Using POST request to login a user at api/auth/login 
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password should not be empty').exists()
], async(req, res)=>{
  let success=false;
  //To return errors upon validation using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  try {
    const {email, password} = req.body;
    let user = await User.findOne({email})
    if(!user){
      return res.status(500).send({success, error: "Please log in with correct credentials"})
    }

    const psdCompare = bcrypt.compare(user.password, password);
    if(!psdCompare){
      return res.status(500).send({success, error: "Please log in with correct credentials"})
    }

    //making authtoken for user
    const data = {
      user : {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success=true;
    res.json({success, authtoken})

    
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Encountered some internal server error");     
  }

}
)


//ROUTE 3: Using POST request to get user details after logging in, at api/auth/getuser 
router.post('/getuser', fetchuser, async(req, res)=>{
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.send(user)    
  } catch (error) {
      console.error(error.message);
      res.status(500).send("Encountered some internal server error");  
  }

})

module.exports = router