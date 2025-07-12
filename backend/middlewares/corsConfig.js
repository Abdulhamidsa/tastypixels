const cors = require("cors");

const allowedOrigins = ["http://localhost:3000", "https://tastypixels.vercel.app", "https://tastypixels.up.railway.app", "https://api.norpus.com", "https://tastypixels-vnvi-git-improvments-abdulhamidsas-projects.vercel.app"];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
