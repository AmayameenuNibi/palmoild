import express from "express";
import passport from "passport";
import axios from "axios";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

//register or login user to DB
router.get("/login/success", async (req, res) => {
  try {
    if (req.user) {
      let credentials;
      const userExists = await User.findOne({ email: req.user._json.email });
      if (userExists) {
        if(userExists.provider){
          credentials = {
            _id: userExists._id,
            name: userExists.name,
            email: userExists.email,
            role: userExists.role,
            status: userExists.status,
          };
          res.redirect(`${process.env.CLIENT_URL}?profile=${encodeURIComponent(JSON.stringify(credentials))}`);
        }else{
          res.redirect(`${process.env.CLIENT_URL}?profile=&&message='User already exist'`);
        }        
      } else {
        const newUser = new User({
          name: req.user._json.name,
          email: req.user._json.email,
          provider: req.user.provider,
          password: Date.now(), // Dummy password
        });
        await newUser.save();
        credentials = {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
        };
        res.redirect(`${process.env.CLIENT_URL}?profile=${encodeURIComponent(JSON.stringify(credentials))}`);      }      
    } else {
      res.status(403).json({
        message: "Not Authorized",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});


router.get("/login-fb/success", async (req, res) => {
  try {
    if (req.user) {
      let credentials;
      const userExists = await User.findOne({ fbaccountId: req.user._json.id, provider: 'facebook'});
      if (userExists) {
        if(userExists.provider){
          credentials = {
            _id: userExists._id,
            name: userExists.name,
            role: userExists.role,
            status: userExists.status,
          };
          res.redirect(`${process.env.CLIENT_URL}?profile=${encodeURIComponent(JSON.stringify(credentials))}`);
        }else{
          res.redirect(`${process.env.CLIENT_URL}?profile=&&message='User already exist'`);
        }        
      } else {
        const newUser = new User({
          name: req.user._json.displayName,
          provider: 'facebook',
          password: Date.now(), // Dummy password
        });
        await newUser.save();
        credentials = {
          _id: newUser._id,
          name: newUser.name,
          role: newUser.role,
          status: newUser.status,
        };
        res.redirect(`${process.env.CLIENT_URL}/?profile=${encodeURIComponent(JSON.stringify(credentials))}`);      }      
    } else {
      res.status(403).json({
        message: "Not Authorized",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

router.get("/login-link/success", async (req, res) => {
  try {
    if (req.user) {
      let credentials;
      const userExists = await User.findOne({ fbaccountId: req.user._json.id, provider: 'facebook'});
      if (userExists) {
        if(userExists.provider){
          credentials = {
            _id: userExists._id,
            name: userExists.name,
            role: userExists.role,
            status: userExists.status,
          };
          res.redirect(`${process.env.CLIENT_URL}?profile=${encodeURIComponent(JSON.stringify(credentials))}`);
        }else{
          res.redirect(`${process.env.CLIENT_URL}?profile=&&message='User already exist'`);
        }        
      } else {
        const newUser = new User({
          name: req.user._json.displayName,
          provider: 'facebook',
          password: Date.now(), // Dummy password
        });
        await newUser.save();
        credentials = {
          _id: newUser._id,
          name: newUser.name,
          role: newUser.role,
          status: newUser.status,
        };
        res.redirect(`${process.env.CLIENT_URL}/?profile=${encodeURIComponent(JSON.stringify(credentials))}`);      }      
    } else {
      res.status(403).json({
        message: "Not Authorized",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

//authenticate the user using google

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/login/success", 
    failureRedirect: "/auth/login/failed", 
  })
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/auth/login-fb/success",
    failureRedirect: "/auth/login/failed",
  })
);


router.get("/linkedin",passport.authenticate("linkedin", {scope: ["r_basicprofile", "r_emailaddress"]}));
router.get(
  "/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/auth/login-link/success",
    failureRedirect: "/auth/login/success",
  })
);

//login failed
router.get("/login/failed", (req, res) => {
  res.status(401);
  throw new Error("Login Failed");
});

//logout
router.get("/logout", (req, res) => {
  console.log("2");
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/s");
  });
});

export default router;
