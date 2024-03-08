const router = require("express").Router();
const passport = require("./passport");
const loggedinuserdata = require("../models/loginedUserSchema");

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "../loginsuccess",
    failureRedirect: "../loginfailed",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    prompt: "consent",
    response_type: "code",
    redirect_uri: "https://inventoflow.onrender.com/auth/google/callback",
  })
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent",
    redirect_uri: "https://inventoflow.onrender.com/auth/google/callback",
  })
);

router.get("/logout", (req, res) => {
  console.log("session id: " + req.session.id);
  req.session.destroy();
  res.send("destroyed");
});

router.get("/loginsuccess", async(req, res) => {
  console.log("consol.log", req.user._json);
  // const user = JSON.parse(req.user._json);
  if (!req.user) {
    res.send("no user found");
  }
  // save user in database
  if (req.user) {
    const fullName = req.user._json.name;
    const userName = req.user._json.given_name;
    const userEmail = req.user._json.email;
    const url = req.user._json.picture;
    console.log(fullName, userEmail,url)
    // res.status(200).json({
    //     status: "success",
    //     message: "Log in success",
    //     user: req.user
    // })
    console.log("ok", typeof req.user._json.email_verified);
    if (req.user._json.email_verified == true) {
      console.log("ok");
      await loggedinuserdata.findOne({ userEmail: userEmail }).then(async (user) => {
        console.log('loggedinuser data:',user)
        if (user) {
          console.log("value of user.googleSginup", user.googleSginup);
          if (!user.googleSginup) {
            res.status(409).json({
              status: "FAILED",
              message:
                "Google signup failed! user with this email already exist!",
            });
          } else {
            const token = await user.generateToken();
            res.cookie("jwt", token);
            // resd
            console.log("cookies:",token)
            res.redirect('https://inventoflow.onrender.com/user');
          }

          // user dashboard with given datas
        }
        // save loggined user .....
        else {console.log('inside to save user')
          const userdata = new loggedinuserdata({
            userEmail: userEmail,
            userName: fullName,
            googleSginup: true,
            signupDate: Date.now(),
            profileImgUrl: url,
          });
          userdata.save();

          const token = await userdata.generateToken();
          res.cookie("jwt", token);
        //   res.status(201).json({
        //     status: "SUCCESS",
        //     message: "token generated successfully",
        //     jwt: token,
        //   });
        console.log("cookies:",token)
        res.redirect('https://inventoflow.onrender.com/user');
        }
      });
    }
    // console.log('full: ',fullName,'user:',userName,'email:',userEmail)
    // res.redirect('http://localhost:5000/')
  } else {
    res.send("unauthorized");
  }
});

router.post("/google", (req, res) => {
  res.json({
    message: "post request",
  });
});
router.get("/loginfailed", (req, res) => {
  res.status(401).json({
    status: "error",
    message: "Log in failur",
  });
});
module.exports = router;
