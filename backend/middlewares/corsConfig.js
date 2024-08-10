const cors = require("cors");

const corsOptions = {
  origin: ["http://localhost:3000", "https://tastypixels-backend.up.railway.app"],
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = cors(corsOptions);
