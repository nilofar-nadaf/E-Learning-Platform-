const express = require("express");
const cors = require("cors");
const app = express();
const pool = require("./Database/pool");
const userRoutes = require("./Routes/user")
const { auth, requireAdmin } = require('./utils/auth')
const courseRoutes = require("./Routes/course");
const videoRoutes = require("./Routes/video");
const studentRoutes = require("./Routes/student");
const adminRoutes = require("./Routes/admin");
//This will allow our frontend to communicate with the backend.
app.use(cors());
//This tells Express:
//"If the client sends JSON data, understand it."
//For example, later React may send:
//{
//    "email": "student@gmail.com",
//    "password": "12345"
//}
//Express can read that using express.json().
app.use(express.json());
app.use('/user',userRoutes)
app.use('/course', courseRoutes);
app.use('/video',videoRoutes);
app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);
//Our backend runs on port 5000.
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});