const User = require("../models/user.js");



module.exports.renderSignup = (req, res)=>{
    res.render("users/signup.ejs");
}


module.exports.signupForm = async(req, res, next) => {
    try {
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to WanderLust!!');
            return res.redirect('/listings');
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


module.exports.renderLogin = (req, res)=>{
    res.render("users/login.ejs")
}


module.exports.loginForm = async (req, res) => {
    req.flash("success", "Welcome back!!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logoutForm =(req, res, next)=>{
    req.logout((err)=>{
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings")
    })

}