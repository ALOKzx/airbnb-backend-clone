const { check, validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("./auth/login", {
    title: "Login",
    currentPage: "/login",
    isLoggedIn: false,
    errorMessage: [],
    oldValues: {},
    user: {}
  });
};

exports.postLogin = async (req, res, next) => {

  const {email, password} = req.body;
  const user = await User.findOne({email});

    if(!user) {
      return res.status(402).render("auth/login", {
        currentPage: "/login",
        title: "Login",
        isLoggedIn: false,
        errorMessage: ["User not found"],
        oldValues: {
          email
        },
        user: {}
      });
    }

    const isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch) {
    return res.status(402).render("auth/login", {
      currentPage: "/login",
      title: "Login",
      isLoggedIn: false,
      errorMessage: ["Incorrect password"],
      oldValues: {
        email
      },
      user: {}
    });
  }
    req.session.isLoggedIn = true;
    req.session.user = user;
    await req.session.save();
    res.redirect("/");
 
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.getSignup = (req, res, next) => {
  res.render("./auth/signup", {
    title: "Create a account",
    currentPage: "/signup",
    isLoggedIn: false,
    errorMessage: [],
    oldValues: {},
    user: {}
  });
};

exports.postSignup = [
  check("firstName")
    .notEmpty()
    .withMessage("First Name is required")
    .isLength({ min: 2 })
    .withMessage("First Name should have minimum 2 characters long")
    .trim()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First Name can only contains letters"),

  check("lastName")
    .trim()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First Name can only contains letters"),

  check("email")
    .isEmail()
    .withMessage("Please Enter a valid email")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be atleast min 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain atleast 1 lowercase letters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain atleast 1 uppercase letters")
    .matches(/[0-9]/)
    .withMessage("Password must contain atleast 1 numbers")
    .matches(/[!@#$&*]/)
    .withMessage("Password must contain atleast 1 special characters")
    .trim(),

  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password do not match");
      }
      return true;
    }),

  check("userType")
    .notEmpty()
    .withMessage("User Type is required")
    .isIn(["guest", "host"])
    .withMessage("Invalid User Type"),

  check("terms")
    .notEmpty()
    .withMessage("You must accept the terms and conditions")
    .custom((value, { req }) => {
      if (value !== "on") {
        throw new Error("You must accept the terms and conditions");
      }
      return true;
    }),

  (req, res, next) => {
    const { firstName, lastName, email, password, userType } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(req.body);
      return res.status(402).render("auth/signup", {
        currentPage: "/signup",
        title: "SignUp",
        isLoggedIn: false,
        errorMessage: errors.array().map((error) => error.msg),
        oldValues: {
          firstName,
          lastName,
          email,
          userType,
          user: {}
        },
      });
    }

    bcrypt.hash(password, 12).then((hashedpassword) => {
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedpassword,
        userType: userType,
      });
      return user
        .save()
        .then((user) => {
          res.redirect("/login");
          console.log("user added", user);
        })
        .catch((err) => {
          return res.status(402).render("auth/signup", {
            currentPage: "/signup",
            title: "SignUp",
            isLoggedIn: false,
            errorMessage: [err.message],
            oldValues: {
              firstName,
              lastName,
              email,
              userType,
              user: {}
             
            },
          });
        });
    });
  },
];
