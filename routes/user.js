const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js")

const reviewController = require("../controllers/users.js");



router.route("/signup")
.get(reviewController.renderSignup)
.post(wrapAsync(reviewController.signupForm));

router.route("/login")
.get(reviewController.renderLogin)
.post( 
  saveRedirectUrl, 
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  wrapAsync(reviewController.loginForm)
);




router.get("/logout", reviewController.logoutForm)



module.exports = router;