const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require ('multer');
const path = require('path');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');
const Token = require('../../models/Token');

// Set the storage engine
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb){
      cb(null, file.fieldname + '-' + Date.now() + '-' + Math.floor(Math.random() * Math.floor (99999999999) ) + path.extname (file.originalname));
      path.extname(file.originalname)
  }
})

//Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 20000000}, // In bytes: 20000000 bytes = 2 MB
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myFile');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /pdf|jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null, true);
  } else {
    cb('Error: PDF, JPEG, JPG, PNG, GIF only !');
  }
};

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));
router.post('/cv', (req, res) => res.json({ msg: 'CV works' }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              if (err) { return res.status(500).send({ msg: err.message }); }
 
              // Create a verification token for this user
              var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
      
              // Save the verification token
              token.save(function (err) {
                if (err) { return res.status(500).send({ msg: err.message }); }
    
                // Send the email
                var transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: 'codingconnection26@gmail.com', pass: '@France1998' } });
                var mailOptions = { from: 'no-reply@coding-connection.fr', to: user.email, subject: '[Coding Connection] Veuillez vérifier votre adresse email', text: 'Bonjour ' + user.name + ' veuillez vérifier votre adresse e-mail en cliquant sur le lien suivant: \nhttp:\/\/localhost:3000\/confirmation\/' + token.token + '.\n' };
                transporter.sendMail(mailOptions, function (err) {
                  if (err) { return res.status(500).send({ msg: err.message }); }
                  res.status(200).send('A verification email has been sent to ' + user.email + '.');
                  res.json(user)
                });
              });
              })
              .catch(err => console.log(err));
            })
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload
        

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

/**
* GET /confirmation
*/
  router.get('/confirmation/:token', function (req, res, next) {
  // req.assert('email', 'Email is not valid').isEmail();
  // req.assert('email', 'Email cannot be blank').notEmpty();
  // req.assert('token', 'Token cannot be blank').notEmpty();
  // req.sanitize('email').normalizeEmail({ remove_dots: false });

  // Check for validation errors    
  // var errors = req.validationErrors();
  // if (errors) return res.status(400).send(errors);

  // Find a matching token
  Token.findOne({ token: req.params.token }, function (err, token) {
      if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
      // If we found a token, find a matching user
      User.findOne({ _id: token._userId}, function (err, user) {
          if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
          if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
          // Verify and save the user
          user.isVerified = true;
          user.save(function (err) {
              if (err) { return res.status(500).send({ msg: err.message }); }
              res.status(200).send("The account has been verified. Please log in.");
          });
      });
  });
});

/**
* POST /resend
*/
  router.post('/resend', function (req, res, next) {
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  // Check for validation errors    
  var errors = req.validationErrors();
  if (errors) return res.status(400).send(errors);
  User.findOne({ email: req.body.email }, function (err, user) {
      if (!user) return res.status(400).send({ msg: 'We were unable to find a user with that email.' });
      if (user.isVerified) return res.status(400).send({ msg: 'This account has already been verified. Please log in.' });
      console.log('195');
      // Create a verification token, save it, and send email
      var token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

      // Save the token
      token.save(function (err) {
          if (err) { return res.status(500).send({ msg: err.message }); }

          // Send the email
          var transporter = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD } });
          var mailOptions = { from: 'no-reply@codemoto.io', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
          transporter.sendMail(mailOptions, function (err) {
              if (err) { return res.status(500).send({ msg: err.message }); }
              res.status(200).send('A verification email has been sent to ' + user.email + '.');
          });
      });

  });
});

router.put('/upload_avatar/:id', (req, res) => {
  upload(req, res, (error) => {
    if (error)
      res.json({ error : error })
    else {
      if (req.file === undefined) {
        res.json('Error: No file selected!')
      } else {
        let data = req.file.filename
        Profile.findOneAndUpdate({user:req.params.id}, { avatar:data }, { new:true }, (err, message) => {
          res.json(data)
        })
      }
    } 
  });
});
module.exports = router;
