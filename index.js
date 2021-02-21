

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// connect to db
mongoose.connect(
process.env.DB,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
},
() => console.log("connected to db")
);


// import routes
const verifyToken = require("./routes/verifyjwt");

const userRoutes = require("./routes/users");
const patientRoutes = require("./routes/patients")

// route middlewares
app.use(express.json()); // for body parser
app.use("/api/users",verifyToken, userRoutes);
app.use("/api/patients", patientRoutes)
app.listen(3000, () => console.log("server is running..."));