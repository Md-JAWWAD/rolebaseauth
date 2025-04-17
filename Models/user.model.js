import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  role: {
    type: String,
  },
  password: {
    type: String,
    require: true,
  },
});

const model = mongoose.model("login_signup_api", userSchema);

export default model;
