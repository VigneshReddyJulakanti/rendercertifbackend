const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

// Connect DB
mongoose
  .connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongoDB is connected"))
  .catch((err) => console.log(err));

// Middleware
app.use(express.json());
app.use(cors());
app.get("/",(req,res)=>{
  res.send("you are in home of server")
});
// Route
app.use("/user", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));
const port = process.env.PORT || 5000 
app.listen(port, () => console.log("Server is running"));
