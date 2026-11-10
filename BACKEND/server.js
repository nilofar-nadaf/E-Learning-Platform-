
const express = require("express");
const cors = require("cors");

const app = express();

const userRoutes = require("./Routes/user");
const courseRoutes = require("./Routes/course");
const videoRoutes = require("./Routes/video");
const studentRoutes = require("./Routes/student");
const adminRoutes = require("./Routes/admin");

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/course", courseRoutes);
app.use("/video", videoRoutes);
app.use("/student", studentRoutes);
app.use("/admin", adminRoutes);

// Run a local server when starting with npm start.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Make the Express app available to Vercel.
module.exports = app;
