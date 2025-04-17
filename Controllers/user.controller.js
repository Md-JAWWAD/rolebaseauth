import model from "../Models/user.model.js";
import productModel from "../Models/product.model.js";
import env from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// const getUserData = async (req, res) => {
//     try {
//         const getAllUsers = await model.find()
//     } catch (error) {

//     }
// }

// Simple SignUp and Login Apis Creation Without Authentication:

// const userSignup = async (req, res) => {
//   try {
//     const userStoredData = await model.create(req.body);
//     const { name, email, password } = userStoredData;
//     res
//       .status(200)
//       .json({ message: "user stored", data: `Name: ${name} Email: ${email}` });
//   } catch (error) {
//     res.status(404).json({ message: `${error}` });
//   }
// };

// const userLogin = async (req, res) => {
//   try {
//     const { email, password } = await req.body;
//     const userStoredData = await model.find({email, password});
//     !userStoredData
//       ? // const { email, password } = userStoredData;
//         res.status(404).json({ message: `Email or Password Wrong` })
//       : res
//           .status(200)
//           .json({ message: "Login Successfully", data: `Email: ${email}` })
//           getUserData()
//   } catch (error) {
//     res.status(404).json({ message: `${error}` });
//   }
// };

const allUser = async (req, res) => {
  const getAllUsers = await model.find({});
  if (getAllUsers) return res.send(getAllUsers);
};

const userSignup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await model.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user object
    const userObj = {
      name,
      email,
      role,
      password: hashPassword,
    };

    // Save user to database
    const userStored = await model.create(userObj);

    delete userStored.password;

    var token = jwt.sign(
      {
        name: userStored.name,
        email: userStored.email,
        role: userStored.role,
      },
      process.env.JWT_SECRET_KEY
    );

    // Remove password from response
    const userResponse = {
      _id: userStored._id,
      name: userStored.name,
      email: userStored.email,
      role: userStored.role,
      createdAt: userStored.createdAt,
    };

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      data: userResponse,
      token: token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = await req.body;
    if (!email || !password)
      return res.json({ message: "Email and Password required" });
    // console.log(password);
    // let tokenHeader = req.headers.authorization.split(" ")[1]
    const userDataforLogin = await model.findOne({ email });
    // console.log(userDataforLogin.password)
    if (!userDataforLogin) return res.json({ message: "Invalid Email" });

    console.log("userdatafor login : ", userDataforLogin);

    var comparePassword = await bcrypt.compare(
      password,
      userDataforLogin.password
    );

    if (!comparePassword) {
      return res.json({ message: "Invalid Password" });
    }

    // let token = jwt.sign(
    //   { userId: userDataforLogin._id },
    //   { email: userDataforLogin.email },
    //   process.env.JWT_SECRET_KEY
    // ); // It cant run because of various objects, It only runs on single objects.

    const payload = {
      userId: userDataforLogin._id,
      email: userDataforLogin.email,
      role: userDataforLogin.role 
    };

    // Generate JWT token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" } // Optional: Set token expiry
    );

    console.log("token : ", token);

    return res.status(200).json({
      success: true,
      message: "Login Successfull",
      token,
      // user: {
      //   id: user._id,
      //   name: user.name,
      //   email: user.email
      // }
    });
  } catch (error) {
    console.log("Login Error");
    return res.json({ message: `${error}` });
  }
};

export { userSignup, userLogin, allUser };
