const User = require("../model/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const errorHandler = require("../utils/error.js");
dotenv.config()
const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  //validation
  if (!username || !email || !password) {
    return next(errorHandler(400, "Fill all requirement"));
  }

  const hashPassword = bcrypt.hashSync(password, 10);
  //create user
  const Newuser = new User({
    username,
    email,
    password: hashPassword,
    
  });
  try {
    await Newuser.save();
    return res.json("SignUp successfully");
  } catch (err) {
    next(err);
  }
};

//signin

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(errorHandler(400, "Fill all requirement"));
  }
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    //token for each user
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );
    const { password: pass, ...rest } = validUser._doc;
    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

//get all users
// const getUsers = async (req, res, next) => {
//   if (!req.user ||!req.user.isAdmin) {
//     return next(errorHandler(403, "You are not allowed to see all users"));
//   }
//   try {
//     const startIndex = Math.max (parseInt(req.query.startIndex) || 0,0);
//     const limit =Math.min (parseInt(req.query.limit) || 9, 100);
//     const sortDirection = req.query.sort === "asc" ? 1 : 1;
//     const users = await User.find()
//       .sort({ createdAt: sortDirection })
//       .skip(startIndex)
//       .limit(limit);

//     const userWithoutPassword = users.map((user) => {
//       const { password, ...rest } = user._doc;
//       return rest;
//     });

//     const totalUsers = await User.countDocuments();

//     const now = new Date();
//     const oneMonthAgo = new Date(
//       now.getFullYear(),
//       now.getMonth() - 1,
//       now.getDate()
//     );
//     const lastMonthUsers = await User.countDocuments({
//       createdAt: { $gte: oneMonthAgo },
//     });
//     res.status(200).json({
//       users: userWithoutPassword,
//       totalUsers,
//       lastMonthUsers,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const deleteUser = async (req, res, next) => {
  
  const { userId } = req.body;

  try {
    User.deleteOne({ _id: userId }),function (err) {
      console.log(err);
    }
    return res.json("User deleted successfully");
  } catch (error) {
    console.log(error);
  }

  
};


 const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.lenght < 4) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username < 2 || req.body.username > 20) {
      return next(
        errorHandler(400, "Username must be between 6 and 20 characters")
      );
    }
   
    
   
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      {
        new: true,
      }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out successfully");
  } catch (error) {
    next(error);
  }
}


const getUsers = async (req, res, next) => {
    User.find()
      .then((users) => 
        res.json(users)
      )
      .catch((err) => 
        next(err)
      );
}
module.exports = { signup, signin, getUsers , deleteUser , signout, updateUser };
