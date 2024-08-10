const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001", "https://tastypixels-git-developing-abdulhamidsas-projects.vercel.app"],
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = cors(corsOptions);
