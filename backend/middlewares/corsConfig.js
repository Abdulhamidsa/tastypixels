const cors = require("cors");
const corsOptions = {
  origin: ["http://localhost:3000", "https://tastypixels.vercel.app", "https://tastypixels.up.railway.app", "https://tastypixels-vnvi-git-improvments-abdulhamidsas-projects.vercel.app"],
  optionsSuccessStatus: 200,
  credentials: true,
};
module.exports = cors(corsOptions);
