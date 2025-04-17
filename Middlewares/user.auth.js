import jwt from "jsonwebtoken";

const userVerify = (roleAuth) => async (req, res, next) => {
  let token;
  console.log(roleAuth[0]);
  // Fix: Added optional chaining (?.) to avoid crashing if `authorization` is missing
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    // Debug: Log raw token and unverified payload
    console.log("Raw Token:", token);
    const unverifiedPayload = jwt.decode(token);
    console.log("Unverified Payload:", unverifiedPayload);

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Verified Payload:", decoded);
    // Attach decoded data to `req.user` for later use
    req.user = decoded;
    const userRole = req.user.role;
    console.log("user role : ", userRole);
    console.log(roleAuth)
    if (roleAuth.includes(userRole)) {
      next();
    } else {
      res.json({ message: "You are not allowed" });
    }
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
    });
  }
};

export default userVerify;
